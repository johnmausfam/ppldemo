import { AnimeInstance } from 'animejs';
import React from 'react';
import Anime, { AnimeProps } from '../../../lib/anime';
import { getRandom, waitFor } from '../../../lib/util';
import { MagicFXAudioMap } from '../audio';
import { I_Props_MagicFX } from '../data';
import { getMonsterPos } from '../pos';

export const FireballFX: React.FC<I_Props_MagicFX> = ({ finishPromise }) => {
    const animeRef = React.useRef<AnimeInstance>();
    React.useEffect(() => {
        animeRef.current?.play();

        animeRef.current?.finished.then(() => {
            finishPromise?.();
        });
        waitFor(1200).then(() => MagicFXAudioMap.fire1.play());
    }, []);
    return (
        <Anime in appear animeRef={animeRef} {...getFireballFx()}>
            <div style={fxNodeStyle} />
        </Anime>
    );
};

export const getFireballFx = (): AnimeProps => {
    return {
        easing: 'easeInQuart',
        duration: 1500,
        autoplay: false,
        translateX: [-3000, 0],
    };
};

const fxNodeStyle = {
    ...getMonsterPos(400, 400),
    zIndex: 600,
    backgroundImage: `url(${require('../assets/fireball.gif')})`,
    backgroundRepeat: 'no-repeat',
    transform: 'rotate(45deg)',
} as React.CSSProperties;
