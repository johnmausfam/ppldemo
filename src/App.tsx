import * as React from 'react';
import { useMainContext } from './lib/reactHook';
import { Main } from './main';
import { ScreenMap } from './screen';
interface I_Props_App {
    process: Main;
    onReady: () => void;
}

interface I_Context_App {
    process: Main;
}

export const AppContext = React.createContext<I_Context_App>(null as any);
const AppContextProvider = React.memo<I_Context_App & { children: React.ReactNode }>(({ process, children }) => {
    return <AppContext.Provider value={React.useMemo(() => ({ process }), [process])}>{children}</AppContext.Provider>;
});


export const App: React.FC<I_Props_App> = ({ process, onReady }) => {
    React.useEffect(() => void onReady(), []);
    return (
        <AppContextProvider process={process}>
            <ScreenRender />
        </AppContextProvider>
    );
};

const ScreenRender = React.memo(() => {
    const { screen } = useMainContext();
    return screen ? React.createElement(ScreenMap[screen]) : null;
});
