import { AnimeInstance } from 'animejs';
import React from 'react';
import Anime, { AnimeProps } from '../../../lib/anime';
import { waitFor } from '../../../lib/util';
import { MagicFXAudioMap } from '../audio';
import { I_Props_MagicFX } from '../data';
import { getMonsterPos } from '../pos';

export const TornadoFX: React.FC<I_Props_MagicFX> = ({ finishPromise }) => {
    const animeRef = React.useRef<AnimeInstance>();
    React.useEffect(() => {
        animeRef.current?.play();
        waitFor(2500).then(() => {
            MagicFXAudioMap.wind3.pause();
            finishPromise?.();
        });
        MagicFXAudioMap.wind3.currentTime = 0;
        MagicFXAudioMap.wind3.play();
    }, []);
    return (
        <Anime in appear animeRef={animeRef} {...getTornadoFx()}>
            <div style={fxNodeStyle} />
        </Anime>
    );
};

export const getTornadoFx = (): AnimeProps => {
    return {
        easing: 'easeInQuart',
        duration: 1200,
        translateX: [-400, -550, 500],
        autoplay: false,
    };
};

const fxNodeStyle = {
    ...getMonsterPos(192, 192),
    zIndex: 600,
    backgroundImage: `url(${require('../assets/tornado.gif')})`,
    backgroundRepeat: 'no-repeat',
    transform: `translateX(-700px) scale(1.5)`,
} as React.CSSProperties;
