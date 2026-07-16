"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

interface AddToCartButtonProps {
  product: any; // We'll type this as any for now, or match the menu_items type
}

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image || null,
    });
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={!product.is_available}
      className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
    >
      <ShoppingCart size={20} />
      <span>{product.is_available ? "Додати в кошик" : "Немає в наявності"}</span>
    </button>
  );
};
