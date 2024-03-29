import { AnimeInstance } from 'animejs';
import React from 'react';
import Anime, { AnimeProps } from '../../../lib/anime';
import { waitFor } from '../../../lib/util';
import { MagicFXAudioMap } from '../audio';
import { I_Props_MagicFX } from '../data';
import { getMonsterPos } from '../pos';

export const ExplosionFX: React.FC<I_Props_MagicFX> = ({ finishPromise }) => {
    const animeRef = React.useRef<AnimeInstance>();
    React.useEffect(() => {
        animeRef.current?.play();
        animeRef.current?.finished.then(() => {
            finishPromise?.();
        });
        waitFor(300).then(() => MagicFXAudioMap.fire3.play());
    }, []);
    return (
        <Anime in appear animeRef={animeRef} {...getExplosionFx()}>
            <div style={fxNodeStyle} />
        </Anime>
    );
};

export const getExplosionFx = (): AnimeProps => {
    return {
        easing: 'steps(19)',
        duration: 1500,
        backgroundPositionX: [192 * 2, -1 * 192 * 17 + 'px'],
        autoplay: false,
    };
};

const fxNodeStyle = {
    ...getMonsterPos(192, 192),
    zIndex: 600,
    backgroundImage: `url(${require('../assets/explosion.png')})`,
    backgroundRepeat: 'no-repeat',
    transform: `scale(4)`,
} as React.CSSProperties;
