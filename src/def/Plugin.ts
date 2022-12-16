import { HookMap } from '../lib/hook';
import { Main } from '../Main';

export interface I_Plugin {
    (process: Main): I_PluginData;
}
export interface I_PluginData {
    hooks: HookMap;
}

export const createPlugin = (plugin: (process: Main) => Partial<I_PluginData>): I_Plugin => {
    const defaultPlugin: I_PluginData = {
        hooks: {},
    };
    return (process: Main) => {
        return { ...defaultPlugin, ...plugin(process) };
    };
};
