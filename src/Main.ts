import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './App';
import { Hooks } from './data/hooks';
import { MainContext } from './data/mainContext';
import { I_MainOption } from './def/mainOption';
import { I_MainContext } from './def/mianContext';
import { I_PluginData } from './def/plugin';
import { Observable, updateObservableOperation, updateObservableOperationByHook } from './lib/observable';
import { AsyncPipeLine, PipeLine, waitOperation } from './lib/pipeline';
import { ScreenCompMap } from './screenComp';

export class Main {
    protected option?: I_MainOption;
    protected plugins: I_PluginData[];
    public context: Observable<I_MainContext>;
    public screenComp = ScreenCompMap;

    constructor(option?: I_MainOption) {
        this.option = option;
        this.context = Observable.create(MainContext.create());
        this.plugins = [];
    }

    getHookMap = () => {
        return this.plugins.map((plugin) => plugin.hooks);
    };

    getContext() {
        return this.context;
    }

    async start() {
        AsyncPipeLine.create(Main.initContext)
            .add(Main.initScreen)
            .add(
                updateObservableOperation(
                    MainContext.screen.Loading.setMessage(`${this.option?.plugins?.length} plugin(s) found,init plugins...`)
                )
            )
            .add(Main.initPlugin)
            .add(waitOperation(1000))
            .add(updateObservableOperation(MainContext.screen.Loading.setMessage('loading plugins...')))
            .add(waitOperation(500))
            .add(updateObservableOperationByHook(this.getHookMap, Hooks['MainContext.asyncLoading']))
            .add(waitOperation(500))
            .add(updateObservableOperation(MainContext.screen.Loading.setMessage('starting game...')))
            .add(waitOperation(250))
            //.add(async (context) => (console.log('### Main.start', 'update context', context.getState()), context))
            .add(updateObservableOperation(MainContext.screen.Landing.show))
            .run(this.context, this);
    }

    async login(playerName: string) {
        this.context.update((context) =>
            PipeLine.create(MainContext.player.initPlayerCharacter(playerName))
                .add(Hooks['MainContext.initPlayerCharacter'](this.getHookMap))
                .add(MainContext.screen.Menu.show)
                .run(context)
        );
    }

    async startBattle() {
        this.context.update((context) =>
            PipeLine.create(MainContext.battle.startBattle(context.player))
                .add(Hooks['App.Battle.initBattle'](this.getHookMap))
                .add(MainContext.screen.Battle.show)
                .run(context, this)
        );
        const battleCtrl = this.context.getState().battle;
        if (battleCtrl) {
            battleCtrl.start();
            await battleCtrl.waitUntilBattleEnd();
        }

        this.context.update((context) =>
            PipeLine.create(MainContext.battle.endBattle())
                .add(Hooks['App.Battle.endBattle'](this.getHookMap))
                .add(MainContext.screen.Menu.show)
                .run(context, this)
        );
    }

    static initPlugin = async (context: Observable<I_MainContext>, process: Main) => {
        process.plugins = process.option?.plugins?.map((plugin) => plugin(process)) ?? [];
        return context;
    };

    static initContext = async (context: Observable<I_MainContext>, process: Main) =>
        context.update(
            PipeLine.create<I_MainContext>(MainContext.screen.Loading.show)
                .add(Hooks['MainContext.init'](process.getHookMap))
                //.add((context) => (console.log('### Main.initContext', 'init context...', context), context))
                .run(context.getState())
        );

    static initScreen = async (context: Observable<I_MainContext>, process: Main) => {
        await new Promise<true>((resolve) => {
            const rootElem = document.getElementById('root');
            if (!rootElem) throw '#root not found';
            ReactDOM.createRoot(rootElem).render(React.createElement(App, { process, onReady: () => resolve(true) }));
        });
        return context;
    };
}
