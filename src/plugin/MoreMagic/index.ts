import { createPlugin } from '../../def/plugin';
import { createHookRunner } from '../../lib/hook';
import { LoadMagicListData } from '../Magic/data';
import { MoreMagicList } from './data';

export const MoreMagic = createPlugin((process) => {
    return {
        hooks: {
            'MagicPlugin.loadMagicList': createHookRunner<LoadMagicListData>((magicData) => {
                return { ...magicData, magicList: magicData.magicList.concat(MoreMagicList) };
            }),
        },
    };
});
