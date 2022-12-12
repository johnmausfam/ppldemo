import * as React from 'react';
import { Hooks } from '../data/hooks';
import { I_Character } from '../def/mianContext';
import { PipeLine } from '../lib/pipeline';
import { useAppContext, useScreenComp } from '../lib/reactHook';

export const CharacterInfo: React.FC<{ className?: string; character: I_Character }> = ({ className, character }) => {
    const { process } = useAppContext();
    const { CharacterInfoPanel } = useScreenComp();

    return (
        <CharacterInfoPanel className={className} characterData={character}>
            {PipeLine.create(Hooks['App.Menu.renderCharacterInfo'](process.getHookMap)).run(
                {
                    renderers: [],
                },
                character
            )}
        </CharacterInfoPanel>
    );
};
