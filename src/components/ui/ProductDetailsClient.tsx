"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingBag, Minus, Plus, MessageSquare, ArrowRightLeft, Check, Star } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { useCompare } from "@/components/providers/CompareProvider";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { Accordion } from "@/components/ui/Accordion";
import { ReviewModal } from "@/components/ui/ReviewModal";

interface Category {
  id: string;
  name: string;
  parent_id?: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  weight?: string;
  image_urls?: string[];
  image?: string; // fallback
  is_available: boolean;
  category_id: string;
  characteristics?: { name: string; value: string }[];
}

interface ProductDetailsClientProps {
  product: Product;
  categoryHierarchy: Category[];
  initialReviews?: any[];
}

export const ProductDetailsClient = ({ product, categoryHierarchy, initialReviews = [] }: ProductDetailsClientProps) => {
  const router = useRouter();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isCompared, toggleCompare } = useCompare();
  
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const favorite = isFavorite(product.id);
  const compared = isCompared(product.id);

  const averageRating = initialReviews.length > 0 
    ? (initialReviews.reduce((acc, r) => acc + r.rating, 0) / initialReviews.length).toFixed(1)
    : 0;

  const images = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls 
    : product.image 
      ? [product.image] 
      : [];

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncrease = () => {
    setQuantity(q => q + 1);
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: images[0] || null,
    });
  };

  const handleBuyInOneClick = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  // Get specific characteristics for the left panel (if they exist)
  const leftPanelCharacteristics = product.characteristics?.filter(c => 
    ['маса', 'крок', 'живлення', 'зарядний', 'матеріал'].some(keyword => c.name.toLowerCase().includes(keyword))
  ) || [];

  return (
    <div className="flex flex-col gap-10">
      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap gap-2 text-sm font-medium text-zinc-500 mb-2">
        <Link href="/" className="hover:text-brand-500 transition-colors">Головна</Link>
        <span>&gt;</span>
        <Link href="/catalog" className="hover:text-brand-500 transition-colors">Каталог</Link>
        {categoryHierarchy.map((cat, index) => (
          <React.Fragment key={cat.id}>
            <span>&gt;</span>
            <span className={index === categoryHierarchy.length - 1 ? "text-zinc-300" : "hover:text-brand-500 cursor-pointer transition-colors"}>
              {cat.name}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image Gallery & Top Characteristics */}
        <div className="w-full flex flex-col gap-8">
          <ImageGallery images={images} />
          
          {leftPanelCharacteristics.length > 0 && (
            <div className="flex flex-col gap-4 text-sm mt-4 pl-12 lg:pl-28">
              {leftPanelCharacteristics.map((char, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-zinc-500">{char.name}</span>
                  <span className="font-bold text-white uppercase tracking-wide">{char.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          {/* Comparison Alert Banner */}
          {compared && (
            <div className="flex items-center justify-between bg-zinc-900/50 border border-brand-500/30 rounded-xl px-4 py-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Check size={16} className="text-brand-500" />
                <span>Додано в список порівняння</span>
              </div>
              <Link href="/compare" className="text-sm font-bold text-brand-500 hover:text-brand-400 transition-colors">
                Переглянути
              </Link>
            </div>
          )}

          <div className="flex justify-between items-start mb-6 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
              {product.name}
            </h1>
            <button 
              onClick={() => toggleCompare(product.id)}
              className={`p-2 rounded-full transition-colors flex-shrink-0 mt-1 ${compared ? 'text-brand-500' : 'text-zinc-400 hover:text-brand-500'}`}
            >
              <ArrowRightLeft size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-2 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 w-16">Бренд:</span>
              <span className="font-bold text-white">CAFEBOUTIQUE</span> {/* Replace with dynamic brand if available */}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 w-16">Код:</span>
              <span className="font-bold text-white">{product.slug.toUpperCase()}</span>
            </div>
          </div>

          {/* Action Row: Quantity, Price, Favorite, Buy 1 Click, Cart */}
          <div className="flex flex-wrap items-center gap-4 mb-10 pb-10 border-b border-zinc-800">
            {/* Quantity Selector */}
            <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden h-12 bg-zinc-900/50">
              <button 
                onClick={handleDecrease}
                className="w-10 h-full flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <Minus size={16} />
              </button>
              <input 
                type="text" 
                value={quantity} 
                readOnly
                className="w-12 h-full bg-transparent text-center font-bold text-white outline-none"
              />
              <button 
                onClick={handleIncrease}
                className="w-10 h-full flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Price */}
            <div className="text-3xl font-black text-white ml-2 mr-auto">
              {product.price.toLocaleString('uk-UA')} ₴
            </div>

            {/* Favorite Button */}
            <button 
              onClick={() => toggleFavorite(product.id)}
              className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all ${
                favorite 
                  ? 'border-brand-500 text-brand-500' 
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
              }`}
            >
              <Heart size={20} className={favorite ? 'fill-current' : ''} />
            </button>

            {/* Buy in 1 Click */}
            <button 
              onClick={handleBuyInOneClick}
              disabled={!product.is_available}
              className="h-12 px-6 rounded-full border border-zinc-600 text-zinc-300 font-bold hover:border-brand-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Купити в один клік
            </button>

            {/* Add to Cart */}
            <button 
              onClick={handleAddToCart}
              disabled={!product.is_available}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-600 text-zinc-300 hover:border-brand-500 hover:text-brand-500 transition-colors shadow-[0_0_15px_rgba(255,92,10,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={20} />
            </button>
          </div>

          {/* Accordions */}
          <div className="flex flex-col">
            <Accordion title="Опис" defaultOpen={true}>
              <div className="prose prose-invert prose-brand max-w-none text-zinc-300 text-sm leading-relaxed">
                <p>{product.description || 'Опис відсутній.'}</p>
              </div>
            </Accordion>
            
            <Accordion 
              title={
                <div className="flex items-center justify-between w-full pr-4">
                  <span>Відгуки</span>
                  {initialReviews.length > 0 && (
                    <span className="bg-zinc-800 text-xs font-bold px-2 py-1 rounded-md text-zinc-300">
                      {initialReviews.length}
                    </span>
                  )}
                </div>
              }
            >
              {initialReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-zinc-500">
                  <MessageSquare size={32} className="mb-3 opacity-20" />
                  <p>Відгуків про цей товар ще не було.</p>
                  <button onClick={() => setIsReviewModalOpen(true)} className="mt-4 text-brand-500 font-medium hover:underline">Написати відгук</button>
                </div>
              ) : (
                <div className="flex flex-col gap-6 pt-2 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white mb-1">Оцінка користувачів</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex text-brand-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={16} fill={star <= averageRating ? "currentColor" : "none"} className={star > averageRating ? "text-zinc-700" : ""} />
                          ))}
                        </div>
                        <span className="font-bold text-white">{averageRating} / 5</span>
                      </div>
                    </div>
                    <button onClick={() => setIsReviewModalOpen(true)} className="text-brand-500 text-sm font-medium hover:underline flex items-center gap-1">
                      <MessageSquare size={14} />
                      Написати відгук
                    </button>
                  </div>

                  <div className="space-y-4 mt-2">
                    {initialReviews.map((review) => (
                      <div key={review.id} className="border-t border-zinc-800/50 pt-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{review.user_name}</span>
                          <span className="text-zinc-500 text-xs">{new Date(review.created_at).toLocaleDateString('uk-UA')}</span>
                        </div>
                        <div className="flex text-brand-500 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={12} fill={star <= review.rating ? "currentColor" : "none"} className={star > review.rating ? "text-zinc-700" : ""} />
                          ))}
                        </div>
                        <p className="text-zinc-300 text-sm">{review.review_text}</p>
                        
                        {review.reply_text && (
                          <div className="mt-3 ml-4 pl-4 border-l-2 border-brand-500/30 bg-zinc-900/50 p-3 rounded-r-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-brand-500 text-xs">Coffee Broadway</span>
                              {review.reply_created_at && (
                                <span className="text-zinc-500 text-[10px]">{new Date(review.reply_created_at).toLocaleDateString('uk-UA')}</span>
                              )}
                            </div>
                            <p className="text-zinc-400 text-sm">{review.reply_text}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Accordion>

            <Accordion title="Задати питання">
              <form className="flex flex-col gap-4 mt-2">
                <input type="text" placeholder="Ваше ім'я" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500" />
                <input type="email" placeholder="Ваш Email" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500" />
                <textarea placeholder="Ваше питання" rows={4} className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"></textarea>
                <button type="button" className="bg-brand-500 text-white font-bold py-3 rounded-lg hover:bg-brand-400 transition-colors">Відправити питання</button>
              </form>
            </Accordion>

            <Accordion title="Характеристики">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between py-2 border-b border-zinc-800/50">
                  <span className="text-zinc-500">Наявність</span>
                  <span className="font-medium text-white">{product.is_available ? 'В наявності' : 'Немає в наявності'}</span>
                </div>
                {product.weight && (
                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-500">Вага / Об'єм</span>
                    <span className="font-medium text-white">{product.weight}</span>
                  </div>
                )}
                {product.characteristics?.map((char, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-500">{char.name}</span>
                    <span className="font-medium text-white">{char.value}</span>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>
        </div>
      </div>
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        productName={product.name}
        productId={product.id}
      />
    </div>
  );
};
