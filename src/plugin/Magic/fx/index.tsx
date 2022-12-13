import * as React from 'react';
import { Observable } from '../../../lib/observable';

export const getMonsterPos = (w: number, h: number): React.CSSProperties => {
    return {
        position: 'absolute',
        width: w,
        height: h,
        left: '50%',
        top: '50%',
        marginLeft: (w / 2) * -1,
        marginTop: (h / 2) * -1,
        overflow: 'hidden',
    };
};

export const gerFullScreenPos = (): React.CSSProperties => {
    return {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
    };
};

export const getHorizontalSpriteCSS = (w: number, h: number, frame: number): React.CSSProperties => {
    return {
        position: 'absolute',
        left: 0,
        top: 0,
        width: w * frame,
        height: h,
    };
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
