import { AnimeInstance } from 'animejs';
import React from 'react';
import Anime, { AnimeProps } from '../../../lib/anime';
import { I_Props_MagicFX } from '../data';
import { getMonsterPos } from '../pos';

export const IceBurstFX: React.FC<I_Props_MagicFX> = ({ finishPromise }) => {
    const animeRef = React.useRef<AnimeInstance>();
    React.useEffect(() => {
        animeRef.current?.play();
        animeRef.current?.finished.then(() => {
            finishPromise?.();
        });
    }, []);
    return (
        <Anime in appear animeRef={animeRef} {...getIceBurstFx()}>
            <div style={fxNodeStyle} />
        </Anime>
    );
};

export const getIceBurstFx = (): AnimeProps => {
    return {
        easing: 'easeInQuart',
        duration: 250,
        autoplay: false,
    };
};

const fxNodeStyle = {
    ...getMonsterPos(192, 192),
    zIndex: 600,
    backgroundImage: `url(${require('../assets/iceburst.gif')})`,
    backgroundRepeat: 'no-repeat',
    transform: `scale(4)`,
} as React.CSSProperties;
