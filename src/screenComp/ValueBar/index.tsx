import * as React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { I_PlayerData } from '../../data/mainContext';

export interface I_Props_ValueBar {
    className?: string;
    maxValue: number;
    style?: React.CSSProperties;
    title: string;
    value: number;
}
export const ValueBar: React.FC<I_Props_ValueBar> = ({ className, maxValue, style, title, value }) => {
    const classes = useStyles();
    return (
        <div className={classNames(classes.root, className)} style={style}>
            <div className="title">{title}</div>
            <div className="valueBlock">
                <div className="value">{value}</div>
                <div className="divider">/</div>
                <div className="maxValue">{maxValue}</div>
            </div>
        </div>
    );
};

const useStyles = createUseStyles({
    root: {
        display: 'flex',
        gap: '.5rem',
        justifyContent: 'space-between',
        alignContent: 'center',
        width: '6rem',
        height: '100%',
        '& > .valueBlock': {
            display: 'flex',
            gap: '.25rem',
            alignContent: 'center',
            '& > *': {},
        },
    },
});
