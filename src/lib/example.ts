import { createAsyncHook, createHook, createHookAsyncRunner, createHookRunner } from './hook';
import { AsyncOperation, AsyncPipeLine, Operation, PipeLine } from './pipeline';

//  AsyncPipeline example
const asyncOper1: AsyncOperation<number, string> = async (input) => '' + input;
const asyncOper2: AsyncOperation<string> = async (input) => input;
const asyncOper3: AsyncOperation<string, { str: string }> = async (str) => ({ str });
AsyncPipeLine.create(asyncOper1)
    .add(asyncOper2)
    .add(asyncOper2)
    .add(asyncOper2)
    .add(asyncOper3)
    .run(1)
    .then((AsyncPipeLineOutput) => {
        console.log('### AsyncPipeLineOutput', AsyncPipeLineOutput);
    });

// pipeline (sync) example
const oper1: Operation<number, string> = (input) => '' + input;
const oper2: Operation<string> = (input) => input;
const oper3: Operation<string, { str: string }> = (str) => ({ str });
const pipelineOutput = PipeLine.create(oper1).add(oper2).add(oper2).add(oper2).add(oper3).run(1);
console.log('### pipelineOutput', pipelineOutput);

//Asyn Hook example
const hookMap = [
    {
        asyncHook1: createHookAsyncRunner<string>(async (input) => input),
        asyncHook2: createHookAsyncRunner<{ str: string }>(async (input) => input),
        hook1: createHookRunner<string>((input) => input),
        hook2: createHookRunner<{ str: string }>((input) => input),
    },
    {
        asyncHook1: createHookAsyncRunner<string>(async (input) => 'hello:' + input),
        asyncHook2: createHookAsyncRunner<{ str: string }>(async (input) => ({ str: '' + input.str, a: 1 })),
    },
];
const asyncHook1 = createAsyncHook<string>('asyncHook1')(hookMap);
const asyncHook2 = createAsyncHook<{ str: string }>('asyncHook2')(hookMap);
AsyncPipeLine.create(asyncOper1)
    .add(asyncOper2)
    .add(asyncHook1)
    .add(asyncOper3)
    .add(asyncHook2)
    .run(1)
    .then((hookAsyncPipeLineOutput) => {
        console.log('### hookAsyncPipeLineOutput (AsyncHookExample)', hookAsyncPipeLineOutput);
    });

// Hook (sync) example
const hook1 = createHook<string>('hook1')(hookMap);
const hook2 = createHook<{ str: string }>('hook2')(hookMap);
const hookPipelineOutput = PipeLine.create(oper1).add(oper2).add(hook1).add(oper3).add(hook2).run(1);
console.log('### hookPipelineOutput', hookPipelineOutput);
