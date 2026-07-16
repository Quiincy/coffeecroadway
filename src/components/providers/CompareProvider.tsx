"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CompareContextType {
  compareItems: string[];
  addCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  isCompared: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("compareItems");
      if (stored) {
        setCompareItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Could not load compare items from local storage", e);
    }
  }, []);

  const saveCompare = (newCompareItems: string[]) => {
    setCompareItems(newCompareItems);
    try {
      localStorage.setItem("compareItems", JSON.stringify(newCompareItems));
    } catch (e) {
      console.error("Could not save compare items to local storage", e);
    }
  };

  const addCompare = (id: string) => {
    if (!compareItems.includes(id)) {
      saveCompare([...compareItems, id]);
    }
  };

  const removeCompare = (id: string) => {
    saveCompare(compareItems.filter((favId) => favId !== id));
  };

  const isCompared = (id: string) => {
    return compareItems.includes(id);
  };

  const toggleCompare = (id: string) => {
    if (isCompared(id)) {
      removeCompare(id);
    } else {
      addCompare(id);
    }
  };

  const clearCompare = () => {
    saveCompare([]);
  };

  const value = {
    compareItems: isMounted ? compareItems : [],
    addCompare,
    removeCompare,
    isCompared: isMounted ? isCompared : () => false,
    toggleCompare,
    clearCompare,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
