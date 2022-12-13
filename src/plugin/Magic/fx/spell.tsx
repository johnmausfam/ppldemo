import { AnimeInstance } from 'animejs';
import React from 'react';
import { gerFullScreenPos, I_Props_MagicFX } from '.';
import Anime, { AnimeProps } from '../../../lib/anime';
import { MagicCategory, MagicCategoryColorMap } from '../data';

export const getBlinkFx = (category: MagicCategory): AnimeProps => {
    const backgroundColor = MagicCategoryColorMap[category];
    return {
        duration: 1000,
        easing: 'steps(10)',
        keyframes: [
            { opacity: 0 },
            { opacity: 0.5, backgroundColor },
            { opacity: 0 },
            { opacity: 0.5, backgroundColor },
            { opacity: 0 },
            { opacity: 0.5, backgroundColor },
            { opacity: 0 },
            { opacity: 0.5, backgroundColor },
            { opacity: 0 },
            { opacity: 0.5, backgroundColor },
        ],
        autoplay: false,
    };
};
export const createSpellFx =
    (category: MagicCategory): React.FC<I_Props_MagicFX> =>
    (props: I_Props_MagicFX) =>
        <SpellFx {...props} category={category} />;
export const SpellFx: React.FC<I_Props_MagicFX & { category: MagicCategory }> = ({ category, finishPromise }) => {
    const animeRef = React.useRef<AnimeInstance>();
    React.useEffect(() => {
        animeRef.current?.play();
        animeRef.current?.finished.then(() => {
            finishPromise?.();
        });
    }, []);
    return (
        <Anime in appear animeRef={animeRef} {...getBlinkFx(category)}>
            <div style={fxNodeStyle} />
        </Anime>
    );
};

const fxNodeStyle = {
    ...gerFullScreenPos(),
    zIndex: 400,
} as React.CSSProperties;
