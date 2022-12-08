import { Battle } from './Battle';
import { Landing } from './Landing';
import { Loading } from './Loading';
import { Menu } from './Menu';

export const ScreenMap = {
    Loading: Loading,
    Landing: Landing,
    Menu: Menu,
    Battle: Battle,
};

export type ScreenKey = keyof typeof ScreenMap;
