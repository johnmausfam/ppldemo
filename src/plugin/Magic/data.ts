import { Battle } from '../../battle';
import { I_BattleAction } from '../../def/battle';
import { AsyncTaskState } from '../../lib/asyncTaskState';
import { createAsyncHook, createHook } from '../../lib/hook';
import { getRandom } from '../../lib/util';

export type LoadMagicListData = { magicList: I_Magic[] };
export const MagicPluginHook = {
    'MagicPlugin.loadMagicList': createHook<LoadMagicListData>('MagicPlugin.loadMagicList'),
    'MagicPlugin.spellMagic': createAsyncHook<I_BattleAction, [I_Magic, Battle, AsyncTaskState]>('MagicPlugin.spellMagic'),
};

export enum MagicCategory {
    Earth = 0,
    Ice = 1,
    Fire = 2,
    Wind = 3,
}
export const MagicCategoryColorMap: Record<MagicCategory, string> = {
    [MagicCategory.Earth]: '#1ea300',
    [MagicCategory.Ice]: '#4287f5',
    [MagicCategory.Fire]: '#cc2b2b',
    [MagicCategory.Wind]: '#c9bf00',
};
export interface I_Magic {
    id: number | string;
    name: string;
    factor: number;
    mp: number;
    category: MagicCategory;
}

export const DefaultMagicList: I_Magic[] = [
    { id: 'fire1', name: '火球', factor: 1, mp: 10, category: MagicCategory.Fire },
    { id: 'ice1', name: '冰塊', factor: 1, mp: 10, category: MagicCategory.Ice },
    { id: 'wind1', name: '風刃', factor: 1, mp: 10, category: MagicCategory.Wind },
    { id: 'earth1', name: '岩彈', factor: 1, mp: 10, category: MagicCategory.Earth },
];

export const getRandomCategory = () => {
    switch (getRandom(0, 99999999) % 4) {
        case 0:
            return MagicCategory.Earth;
        case 1:
            return MagicCategory.Ice;
        case 2:
            return MagicCategory.Fire;
        case 3:
            return MagicCategory.Wind;
    }
};

const MagicCategoryFactorTable = [
    [1, 2, 1, 0.5],
    [0.5, 1, 2, 1],
    [1, 0.5, 1, 2],
    [2, 1, 0.5, 1],
];

export const getCategoryFactor = (sourceCat: MagicCategory, targetCat: MagicCategory) => {
    return MagicCategoryFactorTable[sourceCat][targetCat];
};

export const getCategoryText = (cat: MagicCategory) => {
    switch (cat) {
        case MagicCategory.Earth:
            return '土';
        case MagicCategory.Ice:
            return '水';
        case MagicCategory.Fire:
            return '火';
        case MagicCategory.Wind:
            return '風';
    }
};
