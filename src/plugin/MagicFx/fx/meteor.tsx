import anime, { AnimeInstance } from 'animejs';
import React from 'react';
import Anime, { AnimeProps } from '../../../lib/anime';
import { Observable } from '../../../lib/observable';
import { getRandom, waitFor } from '../../../lib/util';
import { I_Props_MagicFX } from '../data';
import { getMonsterPos } from '../pos';

const itmeCount = Array.from({ length: 15 });

export const MeteorFX: React.FC<I_Props_MagicFX> = ({ finishPromise }) => {
    const [obCount] = React.useState<Observable<number>>(() => Observable.create<number>(0));
    React.useEffect(() => {
        const ob = (count: number) => count == itmeCount.length && finishPromise?.();
        obCount.addObserver(ob);

        new Audio(require('../assets/meteor.mp3')).play();
        waitFor(350).then(() => new Audio(require('../assets/meteor.mp3')).play());
        waitFor(700).then(() => new Audio(require('../assets/meteor.mp3')).play());
        return () => void obCount.removeObserver(ob);
    }, []);
    return (
        <div style={containerStyle}>
            {itmeCount.map((v, i) => (
                <MeteorFXItem key={i} index={i} obCount={obCount} />
            ))}
        </div>
    );
};

const MeteorFXItem: React.FC<{ index: number; obCount: Observable<number> }> = ({ obCount, index }) => {
    const animeRef = React.useRef<AnimeInstance>();
    const [finished, setFinished] = React.useState(false);
    React.useEffect(() => {
        animeRef.current?.play();
        animeRef.current?.finished.then(() => {
            setFinished(true);
            obCount.update((prev) => prev + 1);
        });
    }, []);
    return (
        <Anime in appear animeRef={animeRef} {...getMeteroFx(index)}>
            <div style={React.useMemo(() => getFxNodeStyle(finished), [finished])} />
        </Anime>
    );
};

export const getMeteroFx = (index: number): AnimeProps => {
    return {
        easing: 'easeInQuart',
        duration: 500,
        translateX: 0,
        delay: index * 90,
        autoplay: false,
    };
};

const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    transform: `rotate(45deg)`,
    zIndex: 600,
};

const getFxNodeStyle = (finished?: boolean) =>
    finished
        ? { display: 'none' }
        : ({
              ...getMonsterPos(192, 192),
              backgroundImage: `url(${require('../assets/meteor.gif')})`,
              backgroundRepeat: 'no-repeat',
              transform: `translateX(${getRandom(-1500, -2000)}px) translateY(${getRandom(-150, 150)}px) scale(${getRandom(8, 12) / 10})`,
          } as React.CSSProperties);
