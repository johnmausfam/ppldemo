import { AnimeAnimParams } from 'animejs';

export const getShakeAnimeProps = (xMax = 16) => ({
    easing: 'easeInOutSine',
    duration: 200,
    keyframes: [{ translateX: xMax * -1 }, { translateX: xMax }, { translateX: xMax / -2 }, { translateX: xMax / 2 }, { translateX: 0 }],
    autoplay: false,
});
