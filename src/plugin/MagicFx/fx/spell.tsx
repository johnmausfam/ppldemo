import { AnimeInstance } from 'animejs';
import React from 'react';
import Anime, { AnimeProps } from '../../../lib/anime';
import { MagicCategory, MagicCategoryColorMap } from '../../Magic/data';
import { I_Props_MagicFX } from '../data';
import { gerFullScreenPos } from '../pos';

export const SpellFX: React.FC<I_Props_MagicFX & { category: MagicCategory }> = ({ category, finishPromise }) => {
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

export const createSpellFx =
    (category: MagicCategory): React.FC<I_Props_MagicFX> =>
    (props: I_Props_MagicFX) =>
        <SpellFX {...props} category={category} />;

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

const fxNodeStyle: React.CSSProperties = {
    ...gerFullScreenPos(),
    zIndex: 400,
};
