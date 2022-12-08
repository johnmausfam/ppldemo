import * as React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { I_Props_CharacterInfoPanel } from '../../../../screenComp/CharacterInfoPanel';
import { useScreenComp } from '../../../../lib/reactHook';

export const CharacterInfoPanel: React.FC<I_Props_CharacterInfoPanel> = ({ className, characterData, children }) => {
    const classes = useStyles();
    const { NameCaption, ValueBar } = useScreenComp();
    return (
        <div className={classNames(classes.root, className)}>
            <div className={classes.wrapper}>
                <NameCaption characterData={characterData} />
                <ValueBar title="HP" value={characterData.hp} maxValue={characterData.maxhp} />
                {children?.renderers.map(
                    (renderer, index) => (
                        console.log('### children?.renderers:', index), (<React.Fragment key={index}>{renderer()}</React.Fragment>)
                    )
                )}
            </div>
        </div>
    );
};

const useStyles = createUseStyles({
    root: {
        position: 'absolute',
        background: '#fefefe',
        borderLeft: '.25rem solid #063970',
        padding: '.5rem',
        left: '1rem',
        top: '1rem',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '.5rem',
        height: '4rem',
    },
});
