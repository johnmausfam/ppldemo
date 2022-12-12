import { useCallback, useSyncExternalStore } from 'react';
import { AsyncHook, HookMap } from './hook';
import { Operation } from './pipeline';

type ObservableDataType = string | number | {};
type ObservableStateUpdater<T extends ObservableDataType> = (prevState: Readonly<T>) => T;
export type Observer<T extends ObservableDataType> = (state: Readonly<T>) => void;
export class Observable<T extends ObservableDataType> {
    protected state: Readonly<T>;
    protected observers = new Set<Observer<T>>();
    constructor(initData: T) {
        this.state = Object.freeze(initData);
    }
    addObserver(ob: Observer<T>) {
        if (!this.observers.has(ob)) {
            this.observers.add(ob);
        }
        return this;
    }

    removeObserver(ob: Observer<T>) {
        if (this.observers.has(ob)) {
            this.observers.delete(ob);
        }
        return this;
    }

    protected notify() {
        console.log('### notify()', this.state);
        this.observers.forEach((ob) => ob(this.state));
    }

    update(stateUpdater: T | ObservableStateUpdater<T> | ObservableStateUpdater<T>[]) {
        let nextState: T = this.state;
        if (Array.isArray(stateUpdater)) {
            stateUpdater.forEach((updater) => {
                nextState = Object.freeze(updater(nextState));
            });
        } else {
            nextState = Object.freeze(typeof stateUpdater == 'function' ? stateUpdater(nextState) : stateUpdater);
        }
        if (nextState != this.state) {
            this.state = nextState;
            this.notify();
        }
        return this;
    }

    getState() {
        return this.state;
    }

    async try(task: (prevState: Readonly<T>) => Promise<T>) {
        this.update(await task(this.state));
        return this;
    }

    static create<T extends ObservableDataType>(initData: T) {
        return new Observable<T>(initData);
    }

    wait(util: (state: T) => boolean) {
        return new Promise<T>((resolve) => {
            const onNotify: Observer<T> = (state) => {
                if (util(state)) {
                    resolve(state);
                    this.removeObserver(onNotify);
                }
            };
            if (util(this.getState())) resolve(this.getState());
            else this.addObserver(onNotify);
        });
    }
}

export const useObservable = <T extends ObservableDataType>(ob: Observable<T>) => {
    return useSyncExternalStore(
        useCallback(
            (onStoreChange: () => void) => {
                const callback = () => onStoreChange();
                ob.addObserver(callback);
                return () => ob.removeObserver(callback);
            },
            [ob]
        ),
        useCallback(() => ob.getState(), [ob])
    );
};

export const updateObservableOperation =
    <T extends ObservableDataType>(oper: Operation<T>) =>
    async (context: Observable<T>) =>
        context.try(async (context) => oper(context));

export const updateObservableOperationByHook =
    <T extends ObservableDataType, A extends any[] = []>(getHookMap: () => HookMap[], hook: AsyncHook<T, A>) =>
    async (context: Observable<T>, ...args: A) =>
        context.try(async (context) => await hook(getHookMap)(context, ...args));
