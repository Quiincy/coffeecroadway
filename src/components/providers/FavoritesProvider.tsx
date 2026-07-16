"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Could not load favorites from local storage", e);
    }
  }, []);

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } catch (e) {
      console.error("Could not save favorites to local storage", e);
    }
  };

  const addFavorite = (id: string) => {
    if (!favorites.includes(id)) {
      saveFavorites([...favorites, id]);
    }
  };

  const removeFavorite = (id: string) => {
    saveFavorites(favorites.filter((favId) => favId !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  const toggleFavorite = (id: string) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  // To prevent hydration mismatch, we can just use an empty list on the server.
  // The context must always be provided, otherwise useFavorites will throw on the server.
  const value = {
    favorites: isMounted ? favorites : [],
    addFavorite,
    removeFavorite,
    isFavorite: isMounted ? isFavorite : () => false,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
