import { waitFor } from './util';

export type AsyncOperation<T extends {}, R extends {} = T, A extends any[] = []> = (input: T, ...args: A) => Promise<R>;
export class AsyncPipeLine<T extends {}, R extends {} = T, A extends any[] = []> {
    protected runner: AsyncOperation<T, R, A>;
    constructor(runner: AsyncOperation<T, R, A>) {
        this.runner = runner;
    }
    add<NextR extends {}>(oper: AsyncOperation<R, NextR, A>) {
        return new AsyncPipeLine<T, NextR, A>(async (input: T, ...args: A) => {
            return await oper(await this.run(input, ...args), ...args);
        });
    }
    async run(input: T, ...args: A) {
        return await this.runner(input, ...args);
    }
    static create<T extends {}, R extends {} = T, A extends any[] = []>(oper: AsyncOperation<T, R, A>) {
        return new AsyncPipeLine<T, R, A>(oper);
    }
}

export type Operation<T extends {}, R extends {} = T, A extends any[] = []> = (input: T, ...args: A) => R;
export class PipeLine<T extends {}, R extends {} = T, A extends any[] = []> {
    protected runner: Operation<T, R, A>;
    constructor(runner: Operation<T, R, A>) {
        this.runner = runner;
    }
    add<NextR extends {}>(oper: Operation<R, NextR, A>) {
        return new PipeLine<T, NextR, A>((input: T, ...args: A) => {
            return oper(this.run(input, ...args), ...args);
        });
    }
    run(input: T, ...args: A) {
        return this.runner(input, ...args);
    }
    static create<T extends {}, R extends {} = T, A extends any[] = []>(oper: Operation<T, R, A>) {
        return new PipeLine<T, R, A>(oper);
    }
}

export const toAsync = <T extends {}, R extends {} = T, A extends any[] = []>(syncOper: Operation<T, R, A>): AsyncOperation<T, R, A> => {
    return async (input: T, ...args: A) => {
        return syncOper(input, ...args);
    };
};

export const waitOperation =
    <T extends {}, A extends any[] = []>(time: number): AsyncOperation<T, T, A> =>
    async (input: T, ...args: A) => {
        await waitFor(time);
        return input;
    };

export const actOperation =
    <T extends {}, A extends any[] = []>(action: (data: T, ...args: A) => void): AsyncOperation<T, T, A> =>
    async (input: T, ...args: A) => {
        await action(input, ...args);
        return input;
    };
