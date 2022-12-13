import { AnimeProps } from '.';

export const getShakeAnimeProps = (xMax = 16): AnimeProps => ({
    easing: 'easeInOutSine',
    duration: 200,
    keyframes: [{ translateX: xMax * -1 }, { translateX: xMax }, { translateX: xMax / -2 }, { translateX: xMax / 2 }, { translateX: 0 }],
    autoplay: false,
});

export const getHideProps = (): AnimeProps => ({
    easing: 'easeInOutSine',
    duration: 500,
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    autoplay: false,
});
