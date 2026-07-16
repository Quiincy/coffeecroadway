"use client";

import React, { createContext, useContext, ReactNode } from "react";

export type SiteSettings = {
  [key: string]: string;
};

interface SettingsContextType {
  settings: SiteSettings;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
  initialSettings: SiteSettings;
}

export const SettingsProvider = ({ children, initialSettings }: SettingsProviderProps) => {
  return (
    <SettingsContext.Provider value={{ settings: initialSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
