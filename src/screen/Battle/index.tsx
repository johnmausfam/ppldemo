import classNames from 'classnames';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Battle as BattleCtrl } from '../../battle';
import { Hooks } from '../../data/hooks';
import { BattleActionKey, BattleMenuAction, I_Props_BattleActionMenuRenderer } from '../../def/battle';
import { getShakeAnimeProps } from '../../lib/anime/script';
import { useObservable } from '../../lib/observable';
import { PipeLine } from '../../lib/pipeline';
import { useAppContext, useMainContext } from '../../lib/reactHook';
import { depthCopy } from '../../lib/util';
import { CharacterInfo } from '../../screenComp/CharacterInfo';
import { ScreenContainer } from '../Layout';
import Anime from '../../lib/anime';
import { AnimeInstance } from 'animejs';

export const Battle: React.FC = () => {
    const { battle } = useMainContext();
    if (battle) {
        return (
            <ScreenContainer>
                <BattleContent battle={battle} />
            </ScreenContainer>
        );
    }
    return null;
};

const BattleContent: React.FC<{ battle: BattleCtrl }> = ({ battle }) => {
    const classes = useStyles();
    const [action, setAction] = React.useState<BattleMenuAction>({ action: BattleActionKey.Attack });
    const animeRef = React.useRef<AnimeInstance>();
    React.useEffect(() => {
        const ob = () => {
            animeRef.current?.restart();
        };
        battle.getAnimeObservableState('player').addObserver(ob);
        return () => void battle.getAnimeObservableState('player').removeObserver(ob);
    }, []);
    return (
        <Anime in appear animeRef={animeRef} {...getShakeAnimeProps()}>
            <div className={classes.bg}></div>
            <BattleCharacterInfo battle={battle} targetKey="player" />
            <BattleCharacterInfo battle={battle} targetKey="monster" />
            <Monster battle={battle} onClick={() => battle.act(action.action, action.args)} />
            <BattleLogger battle={battle} />
            <BattleActionMenu
                battle={battle}
                action={action}
                onChange={(action) => (action.action == BattleActionKey.Escape ? battle.escape() : setAction(action))}
            />
        </Anime>
    );

    return null;
};

const BattleCharacterInfo: React.FC<{ battle: BattleCtrl; targetKey: 'player' | 'monster' }> = ({ battle, targetKey }) => {
    const classes = useStyles();
    const char = useObservable(battle[targetKey]);
    return <CharacterInfo className={classNames(classes.charInfo, targetKey)} character={char} />;
};

const Monster: React.FC<{ battle: BattleCtrl; onClick?: () => void }> = ({ battle, onClick }) => {
    const classes = useStyles();
    const enable = useObservable(battle.userWaiting);
    const animeRef = React.useRef<AnimeInstance>();
    React.useEffect(() => {
        const ob = () => {
            animeRef.current?.restart();
        };
        battle.getAnimeObservableState('monster').addObserver(ob);
        return () => void battle.getAnimeObservableState('monster').removeObserver(ob);
    }, []);
    return (
        <Anime in appear animeRef={animeRef} {...getShakeAnimeProps()}>
            <div className={classNames(classes.monster, { enable })} onClick={() => enable && onClick?.()}></div>
        </Anime>
    );
};

const BattleLogger: React.FC<{ battle: BattleCtrl }> = ({ battle }) => {
    const classes = useStyles();
    const logs = useObservable(battle.logs);
    return (
        <div className={classes.logger}>
            <div className={classes.loggerView}>
                <div className={classes.loggerWrapper}>
                    {logs.map((log, index) => (
                        <div key={index} className={classNames(classes.log, log.type)}>
                            {log.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BattleActionMenu: React.FC<I_Props_BattleActionMenuRenderer & { battle: BattleCtrl }> = (props) => {
    const classes = useStyles();
    const { process } = useAppContext();
    const enable = useObservable(props.battle.userWaiting);
    return enable ? (
        <div className={classes.actionMenu}>
            <div className={classes.actionMenuPanel}>
                {PipeLine.create(Hooks['App.Battle.renderMainAction'](process.getHookMap))
                    .run(
                        {
                            renderers: [
                                (action) => (
                                    <BattleActionMenuButton {...action} title="攻擊" selectValue={{ action: BattleActionKey.Attack }} />
                                ),
                            ],
                        },
                        props.battle
                    )
                    .renderers.map((renderer, index) => (
                        <React.Fragment key={index}>{renderer(props)}</React.Fragment>
                    ))}
                <BattleActionMenuButton {...props} title="逃跑" selectValue={{ action: BattleActionKey.Escape }} />,
            </div>
            {PipeLine.create(Hooks['App.Battle.renderActionMenuContent'](process.getHookMap))
                .run(
                    {
                        renderers: [],
                    },
                    props.battle
                )
                .renderers.map((renderer, index) => (
                    <React.Fragment key={index}>{renderer(props)}</React.Fragment>
                ))}
        </div>
    ) : null;
};

export const BattleActionMenuButton: React.FC<I_Props_BattleActionMenuRenderer & { title: string; selectValue: BattleMenuAction }> = ({
    title,
    selectValue,
    action,
    onChange,
}) => {
    return (
        <div
            className={classNames('action', { selected: action.action == selectValue.action })}
            onClick={() => onChange?.(depthCopy(selectValue))}
        >
            <span>{title}</span>
        </div>
    );
};

const useStyles = createUseStyles({
    bg: {
        width: '100%',
        height: '100%',
        background: `url(${require('../../asset/doungen.jfif')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        '-webkit-filter': 'sepia(.5) grayscale(.5) brightness(.5)',
    },
    charInfo: {
        '&.monster': {
            left: 'auto',
            right: '1rem',
        },
    },
    monster: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -175,
        marginTop: -175,
        width: 350,
        height: 350,
        background: `url(${require('../../asset/monster.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&.enable': {
            cursor: 'pointer',
            '&:hover': {
                transform: 'scale(1.05)',
            },
        },
    },
    logger: {
        position: 'absolute',
        left: '1rem',
        bottom: '1rem',
        padding: '.5rem',
        backgroundColor: 'rgba(255,255,255,.15)',
    },
    loggerView: {
        position: 'relative',
        width: '30rem',
        height: '10rem',
        overflow: 'hidden',
    },
    loggerWrapper: {
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    log: {
        color: '#fff',
        lineHeight: '1rem',
        fontSize: '.75rem',
    },
    actionMenu: {
        position: 'absolute',
        right: '1rem',
        bottom: '1rem',
        padding: '.5rem',
        height: '10rem',
        backgroundColor: 'rgba(255,255,255,.15)',
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: '1rem',
    },
    actionMenuPanel: {
        display: 'flex',
        flexDirection: 'column',
        width: '6rem',
        gap: '.5rem',
        border: '2px solid #434343',
        padding: '.5rem',
        '& .action': {
            padding: '.5rem',
            lineheight: '1.5rem',
            color: '#fff',
            background: '#434343',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
                background: '#000',
            },
            '&.selected,&.selected:hover': {
                color: '#434343',
                background: '#f2bd0f',
                cursor: 'default',
            },
        },
    },
});
