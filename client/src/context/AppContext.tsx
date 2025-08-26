import { createContext } from "react";

interface AppContextType {

};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children } : { children: React.ReactNode }) => {

    const value = {};

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;