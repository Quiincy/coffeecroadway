"use client";
import React, { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import Image from "next/image";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, totalItems, totalPrice } = useCart();

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-zinc-300 hover:text-brand-500 transition-colors"
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950 border-l border-zinc-800 z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-zinc-800">
          <h2 className="text-xl font-bold">Кошик</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-zinc-500 mt-10">
              Кошик порожній
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 bg-zinc-900 p-2 rounded-lg items-center">
                <div className="relative w-16 h-16 bg-zinc-800 rounded flex-shrink-0">
                  {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded" />}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-brand-500 font-semibold">{item.price} грн</span>
                    <span className="text-zinc-500 text-sm">x{item.quantity}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-zinc-500 hover:text-red-500 p-2">
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            <div className="flex justify-between items-center mb-4 text-lg">
              <span>Разом:</span>
              <span className="font-bold text-brand-500">{totalPrice} грн</span>
            </div>
            <Link 
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-brand-600 hover:bg-brand-500 text-white text-center font-medium py-3 rounded-lg transition-colors"
            >
              Оформити замовлення
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
