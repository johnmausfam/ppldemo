import { Battle } from '../battle';
import { I_Character, I_MainContext } from '../def/mianContext';
import { Main } from '../main';

export const MainContext = {
    create(): I_MainContext {
        return {
            screen: undefined,
            screenData: {
                Loading: { message: '' },
            },
            player: { type: 'player', name: '', hp: 0, maxhp: 0, atk: 0, def: 0, pluginData: {} },
            pluginData: {},
            battle: undefined,
        };
    },
    screen: {
        Loading: {
            show(context: I_MainContext): I_MainContext {
                return {
                    ...context,
                    screen: 'Loading',
                    screenData: { ...context.screenData, Loading: { message: 'Please wait...' } },
                };
            },
            setMessage(message: string) {
                return (context: I_MainContext): I_MainContext => {
                    return {
                        ...context,
                        screenData: { ...context.screenData, Loading: { message } },
                    };
                };
            },
        },
        Landing: {
            show(context: I_MainContext): I_MainContext {
                return {
                    ...context,
                    screen: 'Landing',
                };
            },
        },
        Menu: {
            show(context: I_MainContext): I_MainContext {
                return {
                    ...context,
                    screen: 'Menu',
                };
            },
        },
        Battle: {
            show(context: I_MainContext): I_MainContext {
                return {
                    ...context,
                    screen: 'Battle',
                };
            },
        },
    },
    player: {
        initPlayerCharacter(name: string) {
            return (context: I_MainContext): I_MainContext => {
                return {
                    ...context,
                    player: { ...context.player, ...initPlayerData(), name },
                };
            };
        },
    },
    battle: {
        startBattle(player: I_Character) {
            return (context: I_MainContext, main: Main): I_MainContext => {
                return {
                    ...context,
                    battle: new Battle(main, context.player),
                };
            };
        },
        endBattle() {
            return (context: I_MainContext, main: Main): I_MainContext => {
                return {
                    ...context,
                    battle: undefined,
                };
            };
        },
    },
};

const initPlayerData = (): Pick<I_Character, 'hp' | 'maxhp' | 'atk' | 'def'> => ({ hp: 100, maxhp: 100, atk: 10, def: 5 });
