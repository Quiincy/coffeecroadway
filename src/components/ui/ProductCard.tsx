'use client'

import Link from 'next/link'
import { ShoppingBag, Heart, ArrowRightLeft } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { useFavorites } from '@/components/providers/FavoritesProvider'
import { useCompare } from '@/components/providers/CompareProvider'

export default function ProductCard({ item, listMode = false }: { item: any, listMode?: boolean }) {
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { toggleCompare, isCompared } = useCompare()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.image_urls?.[0] || null
    })
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleFavorite(item.id)
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleCompare(item.id)
  }

  const cardClasses = listMode 
    ? "group bg-zinc-900/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-zinc-800 hover:border-brand-500/50 transition-all flex h-48 hover:shadow-[0_0_30px_rgba(255,92,10,0.1)] hover:-translate-y-1"
    : "group bg-zinc-900/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-zinc-800 hover:border-brand-500/50 transition-all flex flex-col h-full hover:shadow-[0_0_30px_rgba(255,92,10,0.1)] hover:-translate-y-1"

  const imageContainerClasses = listMode
    ? "relative w-48 h-full bg-zinc-900 overflow-hidden flex-shrink-0"
    : "relative aspect-square bg-zinc-900 overflow-hidden"

  return (
    <Link href={`/catalog/${item.slug}`} className={cardClasses}>
      <div className={imageContainerClasses}>
        {item.image_urls?.[0] ? (
          <img 
            src={item.image_urls[0]} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900/50 text-sm">
            Немає фото
          </div>
        )}
        
        {/* Top Right Action (Compare) */}
        <button 
          onClick={handleCompare}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${isCompared(item.id) ? 'bg-brand-500 text-white' : 'bg-zinc-950/50 text-zinc-300 hover:text-white hover:bg-zinc-800'}`}
        >
          <ArrowRightLeft size={16} />
        </button>

        {!item.is_available && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Немає
          </div>
        )}
      </div>
      
      <div className={`p-4 sm:p-6 flex flex-col flex-grow relative z-10 bg-zinc-900/80 backdrop-blur-xl ${listMode ? 'border-l' : 'border-t'} border-zinc-800/50`}>
        <div className="flex-1">
          <h3 className="font-bold text-white text-sm sm:text-lg mb-2 line-clamp-2 group-hover:text-brand-500 transition-colors">
            {item.name}
          </h3>
          {listMode && (
            <p className="text-zinc-400 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
          )}
        </div>
        
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 xl:gap-0 mt-auto pt-4 border-t border-zinc-800/50 sm:border-none">
          <span className="font-black text-base sm:text-xl text-white whitespace-nowrap">{item.price.toLocaleString('uk-UA')} ₴</span>
          
          <div className="flex items-center gap-2 justify-between xl:justify-end">
            <button 
              onClick={handleFavorite}
              className={`p-2 sm:p-2.5 flex-1 xl:flex-none flex justify-center rounded-xl transition-colors border ${isFavorite(item.id) ? 'bg-brand-500/10 border-brand-500 text-brand-500' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-brand-500 hover:border-brand-500'}`}
            >
              <Heart size={18} fill={isFavorite(item.id) ? "currentColor" : "none"} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>

            <button 
              onClick={handleAddToCart}
              disabled={!item.is_available}
              className="bg-brand-500 hover:bg-brand-400 border border-brand-500 text-white p-2 sm:p-2.5 flex-1 xl:flex-none flex justify-center rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,92,10,0.3)]"
            >
              <ShoppingBag size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
