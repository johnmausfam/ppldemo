import * as React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { I_Props_NameCaption } from '../../../../screenComp/NameCaption';
import { PluginDataKey } from '../..';
import { getAvaterStyle } from '../../character';

export const NameCaption: React.FC<I_Props_NameCaption> = ({ className, characterData: playerData }) => {
    const classes = useStyles();
    return (
        <div className={classNames(classes.root, className)}>
            <div className={classes.avater} style={getAvaterStyle(playerData)}></div>
            <div className={classes.label}>
                <div className={classes.icon} />
                <div className={classes.name}>{playerData.name}</div>
            </div>
        </div>
    );
};

const useStyles = createUseStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        gap: '.5rem',
        height: '2.5rem',
    },
    avater: {
        boxSizing: 'border-box',
        width: '2.5rem',
        height: '2.5rem',
        border: '1px solid #555',
        borderRadius: '.1875rem',
        backgroundSize: '2.5rem',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '.5rem',
        borderRadius: '.1875rem',
        background: '#dedede',
        padding: '0 .5rem',
        height: '2.5rem',
    },
    icon: {
        width: '1rem',
        height: '1rem',
        background: `url(${require('../../asset/user.png')})`,
        backgroundSize: '1rem',
    },
    name: {
        fontSize: '1rem',
        lineHeight: '1rem',
        minWidth: '5rem',
    },
});
