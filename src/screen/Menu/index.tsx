import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { useAppContext, useMainContext, useScreenComp } from '../../lib/reactHook';
import { CharacterInfo } from '../../screenComp/CharacterInfo';
import { ScreenContainer } from '../Layout';

export const Menu: React.FC = () => {
    const classes = useStyles();
    const { player } = useMainContext();
    const { process } = useAppContext();
    const { StageButton } = useScreenComp();
    return (
        <ScreenContainer vertical center>
            <div className={classes.map}></div>
            <CharacterInfo character={player} />
            <StageButton className={classes.stage1} onClick={() => process.startBattle()} />
        </ScreenContainer>
    );
};

const useStyles = createUseStyles({
    map: {
        width: '100%',
        height: '100%',
        background: `url(${require('../../asset/game_map.webp')})`,
        '-webkit-filter': 'sepia(.25) grayscale(.75)',
    },
    stage1: {
        top: '25%',
        left: '50%',
    },
});
