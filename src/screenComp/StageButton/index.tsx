import * as React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { I_PlayerData } from '../../data/mainContext';
import { useScreenComp } from '../../lib/reactHook';

export interface I_Props_StageButton {
    className?: string;
    onClick?: () => void;
}
export const StageButton: React.FC<I_Props_StageButton> = ({ className, onClick }) => {
    const classes = useStyles();
    return <div className={classNames(classes.root, className)} onClick={onClick}></div>;
};

const useStyles = createUseStyles({
    root: {
        position: 'absolute',
        background: `url(${require('../../asset/castle.png')})`,
        width: '7rem',
        height: '7rem',
        backgroundSize: '7rem',
        cursor: 'pointer',
        '&:hover': {
            transform: 'scale(1.25)',
        },
    },
});
