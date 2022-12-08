export const waitFor = (time: number) => {
    return new Promise<true>((resolve) => {
        setTimeout(() => resolve(true), time);
    });
};
export const getRandom = (min: number, max: number) => Math.floor(Math.random() * max) + min;
export const depthCopy = <T extends {}>(obj: T): T => JSON.parse(JSON.stringify(obj));
