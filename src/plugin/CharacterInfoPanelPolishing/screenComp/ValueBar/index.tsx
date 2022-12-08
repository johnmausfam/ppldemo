import * as React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { I_Props_ValueBar } from '../../../../screenComp/ValueBar';

export const ValueBar: React.FC<I_Props_ValueBar> = ({ className, maxValue, style, title, value }) => {
    const classes = useStyles();
    const meterStyle = React.useMemo<React.CSSProperties>(() => {
        return {
            width: ((value / maxValue) * 100).toFixed(2) + '%',
        };
    }, [value, maxValue]);
    return (
        <div className={classNames(classes.root, className)} style={style}>
            <div className="title">{title}</div>
            <div className={classes.meterWrapper}>
                <div className={classNames(classes.meter, 'meter')}>
                    <span style={meterStyle} />
                </div>
                <div className="value">{value}</div>
                <div className="maxValue">{maxValue}</div>
            </div>
        </div>
    );
};

const useStyles = createUseStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        width: '8rem',
        height: '100%',
        '& > .title': {
            fontSize: '.75rem',
            lineHeight: '.75rem',
            textAlign: 'left',
        },
        '& .value': {
            fontSize: '.75rem',
            lineHeight: '.75rem',
            textAlign: 'left',
            position: 'absolute',
            left: '.25rem',
            top: '.125rem',
            color: '#fff',
            fontWeight: 'bold',
        },
        '& .maxValue': {
            fontSize: '.75rem',
            lineHeight: '.75rem',
            textAlign: 'right',
            position: 'absolute',
            right: '.25rem',
            top: '.125rem',
            color: '#fff',
            fontWeight: 'bold',
        },
    },
    meterWrapper: {
        position: 'relative',
        border: '1px solid #000',
        borderRadius: '.25rem',
        height: '1rem',
        overflow: 'hidden',
    },
    meter: {
        boxSizing: 'content-box',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: '#454545',
        borderRadius: '.25rem',
        //padding: '10px',
        boxShadow: 'inset 0 -1px 1px rgba(255, 255, 255, 0.3)',
        '& > span': {
            display: 'block',
            height: '100%',

            backgroundColor: 'rgb(9,92,31)',
            backgroundImage: 'linear-gradient(center bottom, rgb(9,92,31) 37%, rgb(84, 240, 84) 69%)',
            boxShadow: 'inset 0 2px 9px rgba(255, 255, 255, 0.3), inset 0 -2px 6px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden',
        },
        '& > span:after': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            bottom: '0',
            right: '0',
            backgroundImage:
                'linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%,   transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent)',
            zIndex: '1',
            backgroundSize: '50px 50px',
            animation: 'move 2s linear infinite',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            borderTopLeftRadius: '20px',
            borderBottomLeftRadius: '20px',
            overflow: 'hidden',
        },
    },
    '@global': {
        '@keyframes move': {
            '0%': {
                backgroundPosition: '0 0',
            },
            '100%': {
                backgroundPosition: '50px 50px',
            },
        },
    },
});
