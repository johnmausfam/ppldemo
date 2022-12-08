import { I_Character } from './mianContext';

export interface I_BattleLog {
    type: 'normal' | 'warn';
    text: string;
}

export interface I_BattleAction {
    action: string;
    args?: any;
    sourceKey: 'player' | 'monster';
    targetKey: 'player' | 'monster';
    source: I_Character;
    target: I_Character;
    result?: I_BattleResult;
    invalid?: boolean;
}

export interface I_BattleResult {
    damage?: number;
}

export interface I_Props_BattleActionMenuRenderer {
    action: BattleMenuAction;
    onChange?: (act: BattleMenuAction) => void;
}
export type BattleActionMenuRenderer = (props: I_Props_BattleActionMenuRenderer) => React.ReactNode;
export type BattleActionMenuRenderData = { renderers: BattleActionMenuRenderer[] };
export type BattleMenuAction = Pick<I_BattleAction, 'action' | 'args'>;

export enum BattleActionKey {
    Attack = '',
    Escape = 'escape',
}
