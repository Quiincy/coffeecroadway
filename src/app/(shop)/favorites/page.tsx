"use client";

import React, { useEffect, useState } from "react";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/utils/supabase/client";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (favorites.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("items")
        .select("*, category:categories(name)")
        .in("id", favorites);

      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    }

    fetchFavorites();
  }, [favorites]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          УЛЮБЛЕНІ <span className="text-brand-500">ТОВАРИ</span>
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          Ваші збережені товари для швидкого доступу.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800 backdrop-blur-sm">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Список порожній</h2>
          <p className="text-zinc-400">
            Ви ще не додали жодного товару до улюблених.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
