import { Battle } from '../battle';
import { ScreenKey } from '../screen';

export interface I_MainContext {
    screen: undefined | ScreenKey;
    screenData: {
        Loading: { message: string };
    };
    player: I_Character;
    pluginData: Record<string, any>;
    battle?: Battle;
}

export interface I_Character {
    name: string;
    hp: number;
    maxhp: number;
    atk: number;
    def: number;
    pluginData: Record<string, any>;
}
