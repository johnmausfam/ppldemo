import { NameCaption } from './NameCaption';
import { CharacterInfoPanel } from './CharacterInfoPanel';
import { StageButton } from './StageButton';
import { ValueBar } from './ValueBar';

export const DefaultScreenCompMap = {
    CharacterInfoPanel: CharacterInfoPanel,
    NameCaption: NameCaption,
    ValueBar: ValueBar,
    StageButton: StageButton,
};
export type ScreenCompMap = typeof DefaultScreenCompMap;

let screenCompMap = DefaultScreenCompMap;
export const ScreenCompMap = {
    getScreenCompMap: () => screenCompMap,
    setScreenCompMap: (replaceScreenCompMap: Partial<ScreenCompMap>) => {
        screenCompMap = { ...screenCompMap, ...replaceScreenCompMap };
    },
};
