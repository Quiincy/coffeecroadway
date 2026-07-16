"use client";
import React from "react";
import { useCart } from "@/components/providers/CartProvider";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { CheckoutForm } from "@/components/CheckoutForm";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatedPage className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Оформлення замовлення</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400 text-lg mb-6">Ваш кошик наразі порожній.</p>
          <Link href="/catalog" className="inline-block bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Перейти до каталогу
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <h2 className="text-xl font-semibold mb-4">Ваші товари ({totalItems})</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 items-center">
                  <div className="relative w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">Немає фото</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p className="text-brand-500 font-semibold">{item.price} грн</p>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 rounded transition-colors"
                    >-</button>
                    <span className="w-4 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 rounded transition-colors"
                    >+</button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors ml-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between items-center text-xl bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <span className="font-semibold">Разом:</span>
              <span className="font-black text-brand-500">{totalPrice} грн</span>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Дані доставки</h2>
              <CheckoutForm items={items} totalPrice={totalPrice} />
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
