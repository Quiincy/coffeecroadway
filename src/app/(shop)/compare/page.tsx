"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCompare } from "@/components/providers/CompareProvider";
import { useCart } from "@/components/providers/CartProvider";
import { createClient } from "@/utils/supabase/client";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export default function ComparePage() {
  const { compareItems, removeCompare, clearCompare } = useCompare();
  const { addItem } = useCart();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompareItems() {
      if (compareItems.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .in("id", compareItems);

      if (!error && data) {
        // Sort items to match the order in compareItems
        const sorted = [...data].sort((a, b) => compareItems.indexOf(a.id) - compareItems.indexOf(b.id));
        setItems(sorted);
      }
      setLoading(false);
    }

    fetchCompareItems();
  }, [compareItems]);

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.image_urls?.[0] || null,
    });
  };

  // Collect all unique characteristic names from all compared items
  const allCharacteristics = Array.from(
    new Set(
      items.flatMap((item) => item.characteristics?.map((c: any) => c.name) || [])
    )
  );

  if (loading) {
    return (
      <AnimatedPage className="container mx-auto px-4 py-12 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </AnimatedPage>
    );
  }

  if (items.length === 0) {
    return (
      <AnimatedPage className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <div className="bg-zinc-900/40 p-12 rounded-3xl border border-zinc-800 backdrop-blur-sm">
          <div className="text-6xl mb-6 opacity-50 flex justify-center">
            <ArrowLeft size={64} className="text-zinc-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 uppercase">Список порівняння порожній</h1>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Ви ще не додали жодного товару для порівняння. Перейдіть до каталогу, щоб обрати товари.
          </p>
          <Link 
            href="/catalog" 
            className="inline-flex bg-brand-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(255,92,10,0.3)]"
          >
            Перейти до каталогу
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
          Порівняння товарів
        </h1>
        <button 
          onClick={clearCompare}
          className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-medium bg-red-500/10 px-4 py-2 rounded-xl"
        >
          <Trash2 size={18} />
          <span className="hidden sm:inline">Очистити список</span>
        </button>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-x-auto p-6 md:p-8 backdrop-blur-sm shadow-2xl scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        <div className="min-w-max flex gap-8">
          
          {/* Main Attributes Row */}
          <div className="flex flex-col gap-6 w-full">
            {/* Headers / Products */}
            <div className="flex gap-6 border-b border-zinc-800/50 pb-8">
              {/* Empty column for labels */}
              <div className="w-48 flex-shrink-0 hidden md:block"></div>
              
              {items.map((item) => (
                <div key={item.id} className="w-64 flex-shrink-0 flex flex-col relative group">
                  <button 
                    onClick={() => removeCompare(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-zinc-950/80 text-zinc-400 hover:text-red-500 rounded-full z-10 transition-colors"
                    title="Видалити з порівняння"
                  >
                    <Trash2 size={16} />
                  </button>
                  <Link href={`/catalog/${item.slug}`} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden aspect-square mb-4 relative hover:border-brand-500 transition-colors block">
                    {item.image_urls?.[0] ? (
                      <img src={item.image_urls[0]} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">Немає фото</div>
                    )}
                  </Link>
                  <Link href={`/catalog/${item.slug}`} className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-brand-500 transition-colors uppercase tracking-tight">
                    {item.name}
                  </Link>
                  <div className="text-2xl font-black text-white mb-4 mt-auto">
                    {item.price.toLocaleString('uk-UA')} ₴
                  </div>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.is_available}
                    className="flex items-center justify-center gap-2 bg-brand-500 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-brand-400 transition-all disabled:opacity-50 w-full"
                  >
                    <ShoppingBag size={18} />
                    Купити
                  </button>
                </div>
              ))}
            </div>

            {/* Base properties */}
            <div className="flex gap-6 py-4 border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors rounded-xl">
              <div className="w-48 flex-shrink-0 font-bold text-zinc-300 md:pl-4 self-center">Наявність</div>
              {items.map((item) => (
                <div key={item.id} className="w-64 flex-shrink-0 text-zinc-400 self-center">
                  <span className={item.is_available ? "text-green-500" : "text-red-500"}>
                    {item.is_available ? "В наявності" : "Немає"}
                  </span>
                </div>
              ))}
            </div>

            {items.some(i => i.weight) && (
              <div className="flex gap-6 py-4 border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors rounded-xl">
                <div className="w-48 flex-shrink-0 font-bold text-zinc-300 md:pl-4 self-center">Вага/Об'єм</div>
                {items.map((item) => (
                  <div key={item.id} className="w-64 flex-shrink-0 text-white font-medium self-center">
                    {item.weight || "—"}
                  </div>
                ))}
              </div>
            )}

            {/* Dynamic Characteristics */}
            {allCharacteristics.map((charName) => (
              <div key={charName} className="flex gap-6 py-4 border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors rounded-xl">
                <div className="w-48 flex-shrink-0 font-bold text-zinc-300 md:pl-4 self-center pr-4 leading-tight">
                  {charName}
                </div>
                {items.map((item) => {
                  const char = item.characteristics?.find((c: any) => c.name === charName);
                  return (
                    <div key={item.id} className="w-64 flex-shrink-0 text-white font-medium self-center">
                      {char ? char.value : "—"}
                    </div>
                  );
                })}
              </div>
            ))}

          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
