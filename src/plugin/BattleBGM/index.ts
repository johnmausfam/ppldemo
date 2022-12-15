import { I_MainContext } from '../../def/mianContext';
import { createPlugin } from '../../def/plugin';
import { createHookRunner } from '../../lib/hook';
import { waitFor } from '../../lib/util';

export const BattleBGM = createPlugin((process) => {
    const bgm = new Audio(require('./asset/bgm.mp3'));
    const sfx = new Audio(require('./asset/Fight1.wav'));
    return {
        hooks: {
            'App.Battle.initBattle': createHookRunner<I_MainContext>((context) => {
                sfx.play();
                waitFor(500).then(async () => {
                    bgm.volume = 1;
                    bgm.currentTime = 0;
                    bgm.play();
                });
                return context;
            }),
            'App.Battle.endBattle': createHookRunner<I_MainContext>((context) => {
                (async () => {
                    while (bgm.volume > 0) {
                        bgm.volume -= 0.1;
                        await waitFor(100);
                    }
                    bgm.pause();
                })();
                return context;
            }),
        },
    };
});
