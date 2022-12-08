import * as React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { useScreenComp } from '../../lib/reactHook';
import { I_Character } from '../../def/mianContext';

export type CharacterInfoRenderer = () => React.ReactNode;
export type CharacterInfoRendererData = { renderers: CharacterInfoRenderer[] };
export interface I_Props_CharacterInfoPanel {
    className?: string;
    characterData: I_Character;
    children?: CharacterInfoRendererData;
}
export const CharacterInfoPanel: React.FC<I_Props_CharacterInfoPanel> = ({ className, characterData, children }) => {
    const classes = useStyles();
    const { NameCaption, ValueBar } = useScreenComp();
    return (
        <div className={classNames(classes.root, className)}>
            <div className={classes.wrapper}>
                <NameCaption characterData={characterData} />
                <ValueBar title="HP" value={characterData.hp} maxValue={characterData.maxhp} />
                {children?.renderers.map((renderer, index) => (
                    <React.Fragment key={index}>{renderer()}</React.Fragment>
                ))}
            </div>
        </div>
    );
};

const useStyles = createUseStyles({
    root: {
        position: 'absolute',
        border: '2px solid #000',
        background: 'rgba(255,255,255,.5)',
        borderRadius: '.5rem',
        padding: '.5rem',
        left: '1rem',
        top: '1rem',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        gap: '.5rem',
        height: '1.5rem',
    },
});
