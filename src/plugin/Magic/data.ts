import { getRandom } from '../../lib/util';

export enum MagicCategory {
    Earth = 0,
    Ice = 1,
    Fire = 2,
    Wind = 3,
}
export interface I_Magic {
    name: string;
    factor: number;
    mp: number;
    category: MagicCategory;
}

export const MagicList: I_Magic[] = [
    { name: '火球', factor: 1, mp: 10, category: MagicCategory.Fire },
    { name: '冰塊', factor: 1, mp: 10, category: MagicCategory.Ice },
    { name: '風刃', factor: 1, mp: 10, category: MagicCategory.Wind },
    { name: '岩彈', factor: 1, mp: 10, category: MagicCategory.Earth },
    { name: '火柱', factor: 4, mp: 45, category: MagicCategory.Fire },
    { name: '冰錐', factor: 4, mp: 45, category: MagicCategory.Ice },
    { name: '雙重風刃', factor: 4, mp: 45, category: MagicCategory.Wind },
    { name: '落石', factor: 4, mp: 45, category: MagicCategory.Earth },
    { name: '爆裂術', factor: 12, mp: 100, category: MagicCategory.Fire }, // 8
    { name: '絕對零度', factor: 12, mp: 100, category: MagicCategory.Ice },
    { name: '龍捲風', factor: 12, mp: 100, category: MagicCategory.Wind },
    { name: '隕石', factor: 12, mp: 100, category: MagicCategory.Earth },
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
