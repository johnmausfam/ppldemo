import * as React from 'react';
import classNames from 'classnames';
import { createUseStyles } from 'react-jss';

interface I_Props_ScreenContainer {
    vertical?: boolean;
    center?: boolean;
    children: React.ReactNode;
}
export const ScreenContainer: React.FC<I_Props_ScreenContainer> = ({ children, center, vertical }) => {
    const classes = useStyles();
    return <div className={classNames(classes.container, { center, vertical })}>{children}</div>;
};

const useStyles = createUseStyles({
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
        '&.vertical': {
            display: 'flex',
            flexDirection: 'column',
            '&.center': {
                justifyContent: 'center',
                alignItems: 'center',
            },
        },
    },
});
