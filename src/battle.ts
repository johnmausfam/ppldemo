import { AudioMap } from './data/audio';
import { Hooks } from './data/hooks';
import { I_BattleAction, I_BattleLog } from './def/battle';
import { I_Character } from './def/mianContext';
import { AsyncTaskState } from './lib/asyncTaskState';
import { Observable } from './lib/observable';
import { actOperation, AsyncPipeLine, waitOperation } from './lib/pipeline';
import { depthCopy, getRandom, waitFor } from './lib/util';
import { Main } from './main';

export class Battle {
    protected main: Main;
    public turn = Observable.create<number>(0);
    public userWaiting = Observable.create<boolean>(false);
    public player: Observable<I_Character>;
    public monster: Observable<I_Character>;
    public logs = Observable.create<I_BattleLog[]>([]);
    public isEnd = Observable.create<boolean>(false);

    protected animeState = {
        monster: Observable.create<number>(0),
        monsterDead: Observable.create<number>(0),
        player: Observable.create<number>(0),
    };

    constructor(main: Main, player: I_Character) {
        this.main = main;
        this.player = Observable.create(Hooks['App.Battle.initPlayer'](main.getHookMap)(depthCopy(player)));
        this.monster = Observable.create(Hooks['App.Battle.initMonster'](main.getHookMap)(this.createMonster()));
    }

    createMonster(): I_Character {
        const hp = getRandom(100, 250);
        return {
            type: 'monster',
            name: '深淵巨獸',
            hp,
            maxhp: hp,
            atk: getRandom(8, 20),
            def: getRandom(5, 10),
            pluginData: {},
        };
    }

    start() {
        this.log(`遭遇到${this.monster.getState().name},戰鬥開始了!`);
        this.nextTurn();
    }

    end() {
        this.isEnd.update(true);
    }

    nextTurn() {
        this.userWaiting.update(true);
        this.turn.update((turn) => turn + 1);
        this.log(`第${this.turn.getState()}回合,等待玩家下達命令...`);
    }

    log(text: string, type: I_BattleLog['type'] = 'normal') {
        this.logs.update((logs) => logs.concat({ text, type }));
    }

    act = async (action: string, args: any) => {
        const actionData = this.createBattleAction('player', 'monster', action, args);
        const getHookMap = this.main.getHookMap;
        if (Hooks['App.Battle.validateAction'](getHookMap)(actionData, this).invalid === true) return;

        this.userWaiting.update(false);

        const player_task = new AsyncTaskState();
        await AsyncPipeLine.create(waitOperation<I_BattleAction, [Battle, AsyncTaskState]>(250))
            .add(actOperation(() => this.log(`${this.player.getState().name}對${this.monster.getState().name}發動攻擊`)))
            .add(waitOperation(250))
            .add(Hooks['App.Battle.beforeAction'](getHookMap))
            .add((action) => this.damage(action, player_task))
            .add(Hooks['App.Battle.afterAction'](getHookMap))
            .run(actionData, this, player_task);

        await player_task.wait();
        const judge1 = await this.judge();
        if (judge1) {
            if (judge1 == 2) {
                this.playAnime('monsterDead');
                AudioMap.dead.play();
            }
            await waitFor(2000);
            this.end();
            return;
        }

        const monster_task = new AsyncTaskState();
        await AsyncPipeLine.create(waitOperation<I_BattleAction, [Battle, AsyncTaskState]>(250))
            .add(actOperation(() => this.log(`${this.monster.getState().name}對${this.player.getState().name}發動攻擊`)))
            .add(waitOperation(250))
            .add(Hooks['App.Battle.beforeAction'](getHookMap))
            .add((action) => this.damage(action, monster_task))
            .add(Hooks['App.Battle.afterAction'](getHookMap))
            .run(this.createBattleAction('monster', 'player', 'attack', null), this, monster_task);

        await Promise.all([monster_task.wait(), waitFor(500)]);
        const judge2 = await this.judge();
        if (judge2) {
            if (judge2 == 2) {
                this.playAnime('monsterDead');
                AudioMap.dead.play();
            }
            await waitFor(2000);
            this.end();
        } else {
            this.nextTurn();
        }
    };

    async damage(action: I_BattleAction, asynTaskState: AsyncTaskState): Promise<I_BattleAction> {
        const countDamageHook = Hooks['App.Battle.damage'](this.main.getHookMap);
        let battleResult = await countDamageHook({ damage: undefined }, action, this, asynTaskState);

        if (battleResult.damage === undefined) {
            //default behavior
            asynTaskState.add(AudioMap.damage.play());
            battleResult.damage = Math.round(
                (Math.max(3, action.source.atk - action.target.def) +
                    action.source.atk *
                        Math.max(
                            0.2,
                            0.5 +
                                (action.source.atk > action.target.def
                                    ? Math.min(2, action.source.atk / action.target.def)
                                    : (-1 * action.source.def) / action.target.atk)
                        )) *
                    getRandom(0.75, 1.25)
            );
            this.log(`${action.target.name}受到了${battleResult.damage}點物理攻擊傷害`);
        } else {
            this.log(`${action.target.name}受到了${battleResult.damage}點傷害`);
        }
        this[action.targetKey].update((target) => ({ ...target, hp: Math.max(0, target.hp - (battleResult.damage ?? 0)) }));
        this.playAnime(action.targetKey);
        await waitFor(500);
        return { ...action, result: battleResult };
    }

    async judge() {
        if (this.player.getState().hp <= 0) {
            this.log(`${this.player.getState().name}已經死了,您戰敗了,戰鬥結束!`);
            await waitFor(1000);
            return 1;
        } else if (this.monster.getState().hp <= 0) {
            this.log(`${this.monster.getState().name}已經死了,您勝利了,戰鬥結束!`);
            await waitFor(1000);
            return 2;
        }
        return 0;
    }

    async waitUntilBattleEnd() {
        return new Promise<void>((resolve) => {
            this.isEnd.addObserver((isEnd) => isEnd && resolve());
        });
    }

    async escape() {
        this.userWaiting.update(false);
        this.log(`${this.player.getState().name}逃跑了,戰鬥結束!`);
        await waitFor(1000);
        this.end();
    }

    createBattleAction(sourceKey: 'player' | 'monster', targetKey: 'player' | 'monster', action: string, args: any) {
        return {
            action,
            args,
            sourceKey,
            targetKey,
            source: depthCopy(this[sourceKey].getState()),
            target: depthCopy(this[targetKey].getState()),
        };
    }

    playAnime(key: keyof typeof this.animeState) {
        this.animeState[key].update((v) => v + 1);
    }

    getAnimeObservableState(key: keyof typeof this.animeState) {
        return this.animeState[key];
    }
}
