import classNames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Battle } from '../../battle';
import { MainContext } from '../../data/mainContext';
import { BattleActionMenuRenderData, I_BattleAction, I_BattleResult, I_Props_BattleActionMenuRenderer } from '../../def/battle';
import { I_Character, I_MainContext } from '../../def/mianContext';
import { createPlugin } from '../../def/plugin';
import { createHookAsyncRunner, createHookRunner } from '../../lib/hook';
import { useScreenComp } from '../../lib/reactHook';
import { getRandom, waitFor } from '../../lib/util';
import { BattleActionMenuButton } from '../../screen/Battle';
import { CharacterInfoRendererData } from '../../screenComp/CharacterInfoPanel';
import { getCategoryFactor, getCategoryText, getRandomCategory, MagicCategory, MagicList } from './data';

const PluginDataKey = 'plugin_magic';
const MagicActionKey = 'magic';
interface I_PluginData_Magic {
    mp: number;
    maxmp: number;
    matk: number;
    category: MagicCategory;
}
export const Maigc = createPlugin((process) => {
    return {
        hooks: {
            'MainContext.asyncLoading': createHookAsyncRunner<I_MainContext>(async (context) => {
                process.context.update(MainContext.screen.Loading.setMessage(`loading Magic plugin...`));
                return context;
            }),
            'MainContext.initPlayerCharacter': createHookRunner<I_MainContext>((context) => {
                context.player.pluginData[PluginDataKey] = {
                    mp: 100,
                    maxmp: 100,
                    matk: 20,
                    category: MagicCategory.Fire,
                } as I_PluginData_Magic;
                return context;
            }),
            'App.Battle.initMonster': createHookRunner<I_Character>((character) => {
                const mp = getRandom(25, 150);
                character.pluginData[PluginDataKey] = {
                    mp,
                    maxmp: mp,
                    matk: getRandom(12, 25),
                    category: getRandomCategory(),
                } as I_PluginData_Magic;
                return character;
            }),
            'App.Menu.renderCharacterInfo': createHookRunner<CharacterInfoRendererData, [I_Character]>((renderData, character) => {
                return { ...renderData, renderers: [...renderData.renderers, () => <ExtendedPlayerInfo character={character} />] };
            }),
            'App.Battle.renderMainAction': createHookRunner<BattleActionMenuRenderData>((renderData) => {
                return {
                    ...renderData,
                    renderers: [
                        ...renderData.renderers,
                        (props) => <BattleActionMenuButton {...props} title="魔法" selectValue={{ action: MagicActionKey, args: 0 }} />,
                    ],
                };
            }),
            'App.Battle.renderActionMenuContent': createHookRunner<BattleActionMenuRenderData, [Battle]>((renderData, battle) => {
                return {
                    ...renderData,
                    renderers: [
                        ...renderData.renderers,
                        (props) =>
                            props.action.action == MagicActionKey && (
                                <MagicMenu {...props} mp={battle.player.getState().pluginData[PluginDataKey].mp} />
                            ),
                    ],
                };
            }),
            'App.Battle.validateAction': createHookRunner<I_BattleAction, [Battle]>((action, battle) => {
                if (action.action == MagicActionKey) {
                    const sourcePluginData = action.source.pluginData[PluginDataKey] as I_PluginData_Magic;
                    const magicData = MagicList[action.args];

                    if (sourcePluginData.mp < magicData.mp) {
                        battle.log(`MP不足以施展「${magicData.name}」!`);
                        action.invalid = true;
                    }
                }
                return action;
            }),
            'App.Battle.beforeAction': createHookAsyncRunner<I_BattleAction, [Battle]>(async (action, battle) => {
                if (action.action == MagicActionKey) {
                    const magicData = MagicList[action.args];
                    battle.log(`${action.source.name}施展了魔法「${magicData.name}」!`);
                    battle[action.sourceKey].update((character) => ({
                        ...character,
                        pluginData: {
                            ...character.pluginData,
                            [PluginDataKey]: {
                                ...character.pluginData[PluginDataKey],
                                mp: character.pluginData[PluginDataKey].mp - magicData.mp,
                            },
                        },
                    }));
                    await waitFor(500);
                }
                return action;
            }),
            'App.Battle.damage': createHookAsyncRunner<I_BattleResult, [I_BattleAction, Battle]>(async (result, action, battle) => {
                console.log('### App.Battle.damage', result, action, battle);
                if (action.action == MagicActionKey) {
                    const sourcePluginData = action.source.pluginData[PluginDataKey] as I_PluginData_Magic;
                    const targetPluginData = action.target.pluginData[PluginDataKey] as I_PluginData_Magic;
                    const magicData = MagicList[action.args];
                    result.damage = Math.round(
                        (sourcePluginData.matk * getCategoryFactor(magicData.category, targetPluginData.category) + 20) *
                            getCategoryFactor(sourcePluginData.category, targetPluginData.category) *
                            magicData.factor *
                            getRandom(0.85, 1.25)
                    );
                }
                return result;
            }),
        },
    };
});

const ExtendedPlayerInfo: React.FC<{ character: I_Character }> = ({ character }) => {
    const classes = useStyles();
    const { ValueBar } = useScreenComp();
    const magicData = character.pluginData[PluginDataKey] as I_PluginData_Magic;
    return (
        <>
            <ValueBar className={classes.magicPI} title="MP" value={magicData.mp} maxValue={magicData.maxmp} />
            <div>屬性:{getCategoryText(magicData.category)}</div>
        </>
    );
};

const MagicMenu: React.FC<I_Props_BattleActionMenuRenderer & { mp: number }> = ({ action, mp, onChange }) => {
    const classes = useStyles();
    return (
        <div className={classes.magicMenu}>
            <div className={classes.magicMenuWrapper}>
                {MagicList.map((magicItem, index) => {
                    const disabled = mp < magicItem.mp;
                    return (
                        <div
                            key={index}
                            className={classNames('item', { selected: !disabled && action.args == index, disabled })}
                            onClick={() => action.args != index && onChange?.({ action: MagicActionKey, args: index })}
                        >
                            {magicItem.name}({magicItem.mp})
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const useStyles = createUseStyles({
    magicPI: {
        '& .meter > span': {
            backgroundColor: 'rgb(9, 44, 92)',
            backgroundImage: 'linear-gradient(center bottom, rgb(9, 44, 92) 37%, rgb(84, 240, 84) 69%)',
        },
    },
    magicMenu: {
        width: '30rem',
        height: '100%',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
            width: '.5rem',
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '3px solid #ffffff',
        },
    },
    magicMenuWrapper: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gridGap: '.5rem',
        '& .item': {
            padding: '.5rem',
            lineheight: '1.5rem',
            color: '#fff',
            background: '#434343',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
                background: '#000',
            },
            '&.selected,&.selected:hover': {
                color: '#434343',
                background: '#f2bd0f',
                cursor: 'default',
            },
            '&.disabled,&.disabled:hover': {
                color: '#434343',
                background: '#9a9a9a',
                cursor: 'default',
            },
        },
    },
});
