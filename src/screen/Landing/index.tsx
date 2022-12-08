import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { useAppContext } from '../../lib/reactHook';
import { ScreenContainer } from '../Layout';

const nameStorageKey = 'player_name_memo';
export const Landing: React.FC = () => {
    const classes = useStyles();
    const { process } = useAppContext();
    const [name, setName] = React.useState(loadPlayerNameFromStorage);
    return (
        <ScreenContainer vertical center>
            <img src={require('../../asset/epicbattle-rbg.png')} />
            <div className={classes.input}>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <button onClick={() => (savePlayerNameToStorage(name), process.login(name))}>Start Game</button>
            </div>
        </ScreenContainer>
    );
};

const useStyles = createUseStyles({
    input: {
        display: 'flex',
        gap: '.5rem',
        width: '20rem',
        height: '2rem',
        '& input': {
            display: 'block',
            flex: 1,
            boxSizing: 'border-box',
            height: '100%',
        },
        '& button': {
            display: 'block',
            flex: '0 0 auto',
            boxSizing: 'border-box',
            height: '100%',
        },
    },
});

const loadPlayerNameFromStorage = () => localStorage.getItem(nameStorageKey) ?? '';
const savePlayerNameToStorage = (playerName: string) => localStorage.setItem(nameStorageKey, playerName);
