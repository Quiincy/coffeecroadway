"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/utils/supabase/client";

interface RecentlyViewedProps {
  currentProductId: string;
}

export const RecentlyViewed = ({ currentProductId }: RecentlyViewedProps) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function handleRecentlyViewed() {
      // 1. Get current history from localStorage
      let viewed: string[] = [];
      try {
        const stored = localStorage.getItem("recently_viewed");
        if (stored) viewed = JSON.parse(stored);
      } catch (e) {}

      // 2. Fetch the items from DB that are in the viewed list (excluding current item)
      const toFetch = viewed.filter((id) => id !== currentProductId).slice(0, 4);

      if (toFetch.length > 0) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("items")
          .select("*, category:categories(name)")
          .in("id", toFetch);

        if (!error && data) {
          // Sort to match the order of 'viewed' list (most recent first)
          const sorted = data.sort((a, b) => toFetch.indexOf(a.id) - toFetch.indexOf(b.id));
          setItems(sorted);
        }
      }

      // 3. Add current item to the top of the viewed list and save
      const newViewed = [currentProductId, ...viewed.filter(id => id !== currentProductId)].slice(0, 10);
      try {
        localStorage.setItem("recently_viewed", JSON.stringify(newViewed));
      } catch (e) {}
    }

    handleRecentlyViewed();
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <div className="mt-20 border-t border-zinc-800 pt-16">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px bg-zinc-800 flex-1"></div>
        <h2 className="text-2xl font-bold text-white tracking-widest text-center">
          НЕЩОДАВНО ПЕРЕГЛЯНУТІ
        </h2>
        <div className="h-px bg-zinc-800 flex-1"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
