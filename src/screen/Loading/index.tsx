import * as React from 'react';
import { ScreenContainer } from '../Layout';
import { createUseStyles } from 'react-jss';
import { useMainContext } from '../../lib/reactHook';

export const Loading: React.FC = () => {
    const classes = useStyles();
    const { screenData } = useMainContext();
    return (
        <ScreenContainer vertical center>
            <img src={require('../../asset/epicbattle-rbg.png')} />
            <div className={classes.message}>{screenData.Loading.message}</div>
        </ScreenContainer>
    );
};

const useStyles = createUseStyles({
    message: {
        width: '50%',
        textAlign: 'center',
        padding: '.5rem 0',
        fontSize: '1.5rem',
        lineHeight: '1.5rem',
    },
});
