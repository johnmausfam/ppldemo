import { AnimeInstance } from 'animejs';
import React from 'react';
import Anime, { AnimeProps } from '../../../lib/anime';
import { getRandom } from '../../../lib/util';
import { I_Props_MagicFX } from '../data';
import { getMonsterPos } from '../pos';

export const RockFX: React.FC<I_Props_MagicFX> = ({ finishPromise }) => {
    const fxNodeRef = React.useRef<HTMLDivElement>(null);
    const animeRef = React.useRef<AnimeInstance>();
    const fxNodeID = React.useMemo(() => 'rock_' + getRandom(10000, 99999), []);
    React.useEffect(() => {
        animeRef.current?.play();
        animeRef.current?.finished.then(() => {
            finishPromise?.();
        });
    }, []);
    return (
        <Anime in appear animeRef={animeRef} {...getRockFx(fxNodeID)}>
            <div id={fxNodeID} ref={fxNodeRef} style={fxNodeStyle} />
        </Anime>
    );
};

const frameProgress = [1, 2, 3, 4, 5, 95, 96, 97, 98, 99, 999];
export const getRockFx = (fxNodeID: string): AnimeProps => {
    return {
        easing: 'easeInQuart',
        duration: 1500,
        autoplay: false,
        translateX: [-500, 0],
        translateY: [-600, 0],
        update: function (anim: AnimeInstance) {
            const target = document.getElementById(fxNodeID);
            if (target) {
                const frameIndex = frameProgress.findIndex((process, frameIndex) => anim.progress < process);

                const { x, y } = spriteXY(frameIndex);
                target.style.backgroundPositionX = x + 'px';
                target.style.backgroundPositionY = y + 'px';
            }
        },
    };
};

const spriteXY = (frame: number) => {
    return { x: (frame * 192 * -1) % (192 * 6), y: Math.floor(frame / 6) * -1 * 192 };
};

const fxNodeStyle = {
    ...getMonsterPos(192, 192),
    zIndex: 600,
    backgroundImage: `url(${require('../assets/rock.png')})`,
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 0,
    backgroundPositionY: 0,
} as React.CSSProperties;
