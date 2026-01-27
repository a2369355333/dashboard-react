import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";

/* ---------- Types ---------- */

// Screenshot data structure used across the app
export interface ScreenshotInfo {
  scoring: string[];
  ratio: string[];
  headcount: string[];
}

// Context value type
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  screenshotInfo: ScreenshotInfo;
  setScreenshotInfo: React.Dispatch<
    React.SetStateAction<ScreenshotInfo>
  >;
}

// Provider props
interface LoadingProviderProps {
  children: ReactNode;
}

/* ---------- Context ---------- */

const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);

/* ---------- Provider ---------- */

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [screenshotInfo, setScreenshotInfo] =
    useState<ScreenshotInfo>({
      scoring: [],
      ratio: [],
      headcount: [],
    });

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
        screenshotInfo,
        setScreenshotInfo,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

/* ---------- Hook ---------- */

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error(
      "useLoading must be used within a LoadingProvider"
    );
  }

  return context;
};
