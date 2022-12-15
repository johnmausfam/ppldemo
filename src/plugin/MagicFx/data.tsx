import * as React from 'react';
import { Observable } from '../../lib/observable';
import { ExplosionFX } from './fx/explosion';
import { FireballFX } from './fx/fireball';
import { IceBurstFX } from './fx/iceburst';
import { MeteorFX } from './fx/meteor';
import { RockFX } from './fx/rock';
import { TornadoFX } from './fx/tornado';

export interface I_MagicFX_Def {
    id: string;
    fxComp: React.ComponentType<I_Props_MagicFX>;
}
const createMagicFXDef = (fxDef: I_MagicFX_Def) => fxDef;
export const MagicFXMap: Record<string, I_MagicFX_Def> = {
    fire3: createMagicFXDef({ id: 'fire3', fxComp: ExplosionFX }),
    earth1: createMagicFXDef({ id: 'earth1', fxComp: RockFX }),
    fire1: createMagicFXDef({ id: 'fire1', fxComp: FireballFX }),
    ice2: createMagicFXDef({ id: 'ice2', fxComp: IceBurstFX }),
    wind3: createMagicFXDef({ id: 'wind3', fxComp: TornadoFX }),
    earth3: createMagicFXDef({ id: 'earth3', fxComp: MeteorFX }),
};

export interface I_Props_MagicFX {
    finishPromise?: () => void;
}

export type FXRenderData = { renderer: () => JSX.Element };
export const createMagicFx = (fxElem: Observable<null | FXRenderData>, FxComp: React.ComponentType<I_Props_MagicFX>) => {
    return new Promise<void>((resolve) => {
        fxElem.update({
            renderer: () => (
                <FxComp
                    finishPromise={() => {
                        fxElem.update(null);
                        resolve();
                    }}
                />
            ),
        });
    });
};
