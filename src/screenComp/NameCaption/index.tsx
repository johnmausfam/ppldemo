import * as React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { I_Character } from '../../def/mianContext';

export interface I_Props_NameCaption {
    className?: string;
    characterData: I_Character;
}
export const NameCaption: React.FC<I_Props_NameCaption> = ({ className, characterData }) => {
    const classes = useStyles();
    return (
        <div className={classNames(classes.root, className)}>
            <div className={classes.label}>{characterData.name}</div>
        </div>
    );
};

const useStyles = createUseStyles({
    root: {
        display: 'flex',
        alignContent: 'center',
        width: '5rem',
        height: '100%',
    },
    label: {},
});
