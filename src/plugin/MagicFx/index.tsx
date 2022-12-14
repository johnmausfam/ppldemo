import * as React from 'react';
import { Battle } from '../../battle';
import { BattleScreenRenderData, I_BattleAction, I_Props_BattleScreenRenderer } from '../../def/battle';
import { createPlugin } from '../../def/plugin';
import { AsyncTaskState } from '../../lib/asyncTaskState';
import { createHookAsyncRunner, createHookRunner } from '../../lib/hook';
import { Observable, useObservable } from '../../lib/observable';
import { I_Magic } from '../Magic/data';
import { createMagicFx, FXRenderData, MagicFXMap } from './data';
import { createSpellFx } from './fx/spell';

export const MagicFX = createPlugin((process) => {
    const fxRenderData = Observable.create<null | FXRenderData>(null);

    return {
        hooks: {
            'MagicPlugin.spellMagic': createHookAsyncRunner<I_BattleAction, [I_Magic, Battle, AsyncTaskState]>(
                async (action, magicData, battleCtrl, taskState) => {
                    console.log('### MagicFX spellMagic', action, magicData);
                    await createMagicFx(fxRenderData, createSpellFx(magicData.category));
                    const fxDef = MagicFXMap[magicData.id];
                    if (fxDef) taskState.add(createMagicFx(fxRenderData, fxDef.fxComp));
                    return action;
                }
            ),
            'App.Battle.renderBattleScreen': createHookRunner<BattleScreenRenderData, [Battle]>((renderData) => {
                renderData.renderers.push((props: I_Props_BattleScreenRenderer) => {
                    return <FXRenderer fxRenderData={fxRenderData} />;
                });
                return renderData;
            }),
        },
    };
});

const FXRenderer = React.memo<{ fxRenderData: Observable<null | FXRenderData> }>(({ fxRenderData }) => {
    return useObservable(fxRenderData)?.renderer() ?? null;
});
