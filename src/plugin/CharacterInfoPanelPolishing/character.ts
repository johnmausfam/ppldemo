import React from 'react';
import { PluginDataKey } from '.';
import { I_Character } from '../../def/mianContext';

export interface I_PluginData_character_CharacterInfoPanelPolishing {
    avater: string;
}
export const getAvaterStyle = (char: I_Character): React.CSSProperties => {
    const avaterID = (char.pluginData[PluginDataKey] as I_PluginData_character_CharacterInfoPanelPolishing)?.avater ?? '';
    return avaterID ? avaterStyleMap[avaterID] : {};
};

const avaterStyleMap: Record<string, React.CSSProperties> = {
    player: { backgroundImage: `url(${require('./asset/avater_player.png')})` },
    monster: { backgroundImage: `url(${require('./asset/avater_monster.png')})` },
};
