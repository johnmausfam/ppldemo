import { Battle } from '../battle';
import { BattleActionMenuRenderData, I_BattleAction, I_BattleResult } from '../def/battle';
import { I_Character, I_MainContext } from '../def/mianContext';
import { createAsyncHook, createHook } from '../lib/hook';
import { Main } from '../main';
import { CharacterInfoRendererData } from '../screenComp/CharacterInfoPanel';

export const Hooks = {
    'MainContext.init': createHook<I_MainContext>('MainContext.init'),
    'MainContext.asyncLoading': createAsyncHook<I_MainContext, [Main]>('MainContext.asyncLoading'),
    'MainContext.initPlayerCharacter': createHook<I_MainContext>('MainContext.initPlayerCharacter'),
    'App.Menu.renderCharacterInfo': createHook<CharacterInfoRendererData, [I_Character]>('App.Menu.renderCharacterInfo'),
    'App.Battle.initBattle': createHook<I_MainContext>('App.Battle.initBattle'),
    'App.Battle.endBattle': createHook<I_MainContext>('App.Battle.endBattle'),
    'App.Battle.initPlayer': createHook<I_Character>('App.Battle.initPlayer'),
    'App.Battle.initMonster': createHook<I_Character>('App.Battle.initMonster'),
    'App.Battle.beforeAction': createAsyncHook<I_BattleAction, [Battle]>('App.Battle.beforeAction'),
    //'App.Battle.inAction': createAsyncHook<I_BattleAction>('App.Battle.inAction'),
    'App.Battle.damage': createAsyncHook<I_BattleResult, [I_BattleAction, Battle]>('App.Battle.damage'),
    'App.Battle.afterAction': createAsyncHook<I_BattleAction, [Battle]>('App.Battle.afterAction'),
    'App.Battle.renderMainAction': createHook<BattleActionMenuRenderData, [Battle]>('App.Battle.renderMainAction'),
    'App.Battle.renderActionMenuContent': createHook<BattleActionMenuRenderData, [Battle]>('App.Battle.renderActionMenuContent'),
    'App.Battle.validateAction': createHook<I_BattleAction, [Battle]>('App.Battle.validateAction'),
};
export type HookKey = keyof typeof Hooks;
