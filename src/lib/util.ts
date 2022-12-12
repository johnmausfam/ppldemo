export const waitFor = (time: number) => {
    return new Promise<true>((resolve) => {
        setTimeout(() => resolve(true), time);
    });
};
export const getRandom = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const depthCopy = <T extends {}>(obj: T): T => JSON.parse(JSON.stringify(obj));
