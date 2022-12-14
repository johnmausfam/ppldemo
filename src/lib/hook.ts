import { waitFor } from './util';

export type HookRunner<T extends {}, A extends any[] = []> = (input: T, ...args: A) => T;
export type AsyncHookRunner<T extends {}, A extends any[] = []> = (input: T, ...args: A) => Promise<T>;
export type HookMap = {
    [P in string]?: HookRunner<any, any[]> | AsyncHookRunner<any, any[]>;
};
export type Hook<T extends {}, A extends any[] = []> = (getHookMap: () => HookMap[]) => HookRunner<T, A>;
export type AsyncHook<T extends {}, A extends any[] = []> = (getHookMap: () => HookMap[]) => AsyncHookRunner<T, A>;

export const createHookRunner = <T extends {}, A extends any[] = []>(runner: HookRunner<T, A>) => runner;
export const createHook =
    <T extends {}, A extends any[] = []>(hookName: string): Hook<T, A> =>
    (getHookMap: () => HookMap[]) => {
        const hookRunners = getHookMap()
            .filter((hookMap) => !!hookMap[hookName])
            .map((hookMap) => hookMap[hookName]) as HookRunner<T, A>[];
        return (input: T, ...args: A) => {
            let output: T = { ...input };
            for (let runner of hookRunners) {
                output = runner(output, ...args);
            }
            return output;
        };
    };
export const createHookAsyncRunner = <T extends {}, A extends any[] = []>(runner: AsyncHookRunner<T, A>) => runner;
export const createAsyncHook =
    <T extends {}, A extends any[] = []>(hookName: string): AsyncHook<T, A> =>
    (getHookMap: () => HookMap[]) => {
        const hookRunners = getHookMap()
            .filter((hookMap) => !!hookMap[hookName])
            .map((hookMap) => hookMap[hookName]) as AsyncHookRunner<T, A>[];
        return async (input: T, ...args: A) => {
            let output: T = { ...input };
            for (let runner of hookRunners) {
                output = await runner(output, ...args);
                await waitFor(500);
            }
            return output;
        };
    };
