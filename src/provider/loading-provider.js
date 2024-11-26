import { createContext, useState, useContext } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [screenshotInfo, setScreenshotInfo] = useState({});

    return (
        <LoadingContext.Provider value={{isLoading, setIsLoading, screenshotInfo, setScreenshotInfo}}>
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => useContext(LoadingContext);
