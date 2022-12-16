import { MainContext } from '../../data/mainContext';
import { I_Character, I_MainContext } from '../../def/mianContext';
import { createPlugin } from '../../def/plugin';
import { createHookAsyncRunner, createHookRunner } from '../../lib/hook';
import { Main } from '../../Main';
import { I_PluginData_character_CharacterInfoPanelPolishing } from './character';
import { NameCaption } from './screenComp/NameCaption';
import { CharacterInfoPanel } from './screenComp/CharacterInfoPanel';
import { ValueBar } from './screenComp/ValueBar';

export const PluginDataKey = 'plugin_CharacterInfoPanelPolishing';
export const CharacterInfoPanelPolishing = createPlugin((process) => {
    return {
        hooks: {
            'MainContext.asyncLoading': createHookAsyncRunner<I_MainContext, [Main]>(async (context) => {
                process.screenComp.setScreenCompMap({
                    ValueBar: ValueBar,
                    CharacterInfoPanel: CharacterInfoPanel,
                    NameCaption: NameCaption,
                });
                process.context.update(MainContext.screen.Loading.setMessage(`loading CharacterInfoPanelPolishing plugin...`));
                return context;
            }),
            'MainContext.initPlayerCharacter': createHookRunner<I_MainContext, [Main]>((context) => {
                context.player.pluginData[PluginDataKey] = { avater: 'player' } as I_PluginData_character_CharacterInfoPanelPolishing;
                return context;
            }),
            'MainContext.initMonsterCharacter': createHookRunner<I_MainContext, [Main]>((context) => {
                context.player.pluginData[PluginDataKey] = { avater: 'player' } as I_PluginData_character_CharacterInfoPanelPolishing;
                return context;
            }),
            'App.Battle.initMonster': createHookRunner<I_Character>((character) => {
                character.pluginData[PluginDataKey] = { avater: 'monster' } as I_PluginData_character_CharacterInfoPanelPolishing;
                return character;
            }),
        },
    };
});
