import { AnimeInstance } from 'animejs';
import React from 'react';
import { getMonsterPos, I_Props_MagicFX } from '.';
import Anime, { AnimeProps } from '../../../lib/anime';

export const getExplosionFx = (): AnimeProps => {
    return {
        easing: 'steps(19)',
        duration: 1500,
        backgroundPositionX: [192 * 2, -1 * 192 * 17 + 'px'],
        autoplay: false,
    };
};

export const ExplosionFx: React.FC<I_Props_MagicFX> = ({ finishPromise }) => {
    const animeRef = React.useRef<AnimeInstance>();
    React.useEffect(() => {
        animeRef.current?.play();
        animeRef.current?.finished.then(() => {
            finishPromise?.();
        });
    }, []);
    return (
        <Anime in appear animeRef={animeRef} {...getExplosionFx()}>
            <div style={spriteStyle} />
        </Anime>
    );
};

const spriteStyle = {
    ...getMonsterPos(192, 192),
    zIndex: 600,
    backgroundImage: `url(${require('../assets/explosion.png')})`,
    backgroundRepeat: 'no-repeat',
    transform: `scale(4)`,
} as React.CSSProperties;
