'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setItems([])
    }
  }, [isOpen])

  // Simple debounce and fetch
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setItems([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/menu')
        const data = await res.json()
        if (data.success && data.items) {
          const lowerQuery = query.toLowerCase()
          
          const filtered = data.items.filter((item: any) => {
            const matchName = item.name?.toLowerCase().includes(lowerQuery)
            const matchSlug = item.slug?.toLowerCase().includes(lowerQuery)
            const matchDesc = item.description?.toLowerCase().includes(lowerQuery)
            
            // Search in characteristics JSON
            const matchCharacteristics = item.characteristics 
              ? JSON.stringify(item.characteristics).toLowerCase().includes(lowerQuery)
              : false
            
            return matchName || matchSlug || matchDesc || matchCharacteristics
          })
          
          setItems(filtered)
        }
      } catch (err) {
        console.error('Search error', err)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/80 backdrop-blur-xl">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 flex flex-col h-full">
        
        {/* Search Input Area */}
        <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-2 sm:p-4 shadow-2xl">
          <Search size={28} className="text-zinc-500 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Пошук товарів за назвою, брендом, кодом..."
            className="w-full bg-transparent border-none text-white text-lg sm:text-2xl font-medium px-4 focus:outline-none focus:ring-0 placeholder:text-zinc-600"
          />
          <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 mt-6 overflow-y-auto scrollbar-none">
          {loading && (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
            </div>
          )}

          {!loading && query.length >= 2 && items.length === 0 && (
            <div className="text-center p-12 text-zinc-500 text-lg">
              За запитом <span className="text-white font-bold">"{query}"</span> нічого не знайдено.
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="flex flex-col gap-3 pb-8">
              <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2 pl-2">
                Знайдено товарів: {items.length}
              </div>
              {items.map(item => (
                <Link 
                  key={item.id} 
                  href={`/catalog/${item.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800/50 rounded-2xl p-3 transition-all hover:border-brand-500/50 group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-950 rounded-xl overflow-hidden flex-shrink-0">
                    {item.image_urls?.[0] ? (
                      <img src={item.image_urls[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600">Немає фото</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm sm:text-lg truncate group-hover:text-brand-500 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-500 truncate mt-1">
                      Код: {item.slug}
                    </p>
                  </div>
                  <div className="font-black text-white text-base sm:text-xl pr-2 sm:pr-4">
                    {item.price.toLocaleString('uk-UA')} ₴
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
