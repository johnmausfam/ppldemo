import * as React from 'react';
import { AppContext } from '../App';
import { useObservable } from './observable';

export const useAppContext = () => React.useContext(AppContext);
export const useMainContext = () => {
    const { process } = useAppContext();
    return useObservable(process.getContext());
};
export const useScreenComp = () => {
    const { process } = useAppContext();
    return process.screenComp.getScreenCompMap();
};
