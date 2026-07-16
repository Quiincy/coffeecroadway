'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, Search, Heart, User, LayoutGrid, Coffee } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { useFavorites } from '@/components/providers/FavoritesProvider'
import { useState, useRef, useEffect } from 'react'
import { SearchModal } from '@/components/ui/SearchModal'

export default function Header({ categories = [] }: { categories?: any[] }) {
  const { totalItems } = useCart()
  const { favorites } = useFavorites()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const megaMenuRef = useRef<HTMLDivElement>(null)

  const topCategories = categories.filter(c => !c.parent_id)
  const subCategories = categories.filter(c => c.parent_id)

  const [activeCategory, setActiveCategory] = useState<string | null>(topCategories[0]?.id || null)

  // Handle click outside to close mega menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between relative">
        
        {/* Left Side: Products button + links */}
        <div className="flex items-center gap-6">
          <div ref={megaMenuRef} className="hidden lg:block">
            <button 
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all border ${
                isMegaMenuOpen 
                  ? 'bg-zinc-900 border-brand-500 text-brand-500 shadow-[0_0_15px_rgba(255,92,10,0.2)]' 
                  : 'bg-zinc-950 border-zinc-800 text-white hover:border-brand-500 hover:text-brand-500'
              }`}
            >
              <LayoutGrid size={20} className={isMegaMenuOpen ? "text-brand-500" : "text-brand-500"} />
              ТОВАРИ
            </button>

            {/* Mega Menu Dropdown */}
            {isMegaMenuOpen && (
              <div className="absolute top-[80px] left-0 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 shadow-2xl p-8 z-50 flex gap-10">
                {/* Top Categories */}
                <div className="w-1/2 flex flex-col gap-2">
                  {topCategories.map(cat => (
                    <div 
                      key={cat.id} 
                      onMouseEnter={() => setActiveCategory(cat.id)}
                      className={`cursor-pointer flex items-center justify-between font-bold text-sm uppercase px-4 py-3 rounded-xl transition-all ${activeCategory === cat.id ? 'text-white bg-brand-500 shadow-[0_0_15px_rgba(255,92,10,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                    >
                      <Link href={`/catalog/category/${cat.slug}`} onClick={() => setIsMegaMenuOpen(false)} className="w-full">
                        {cat.name}
                      </Link>
                      <span className={activeCategory === cat.id ? 'text-white' : 'text-zinc-600'}>→</span>
                    </div>
                  ))}
                </div>

                {/* Sub Categories */}
                <div className="w-1/2 flex flex-col gap-2 border-l border-zinc-800 pl-10">
                  {subCategories.filter(c => c.parent_id === activeCategory).map(cat => (
                    <Link 
                      key={cat.id} 
                      href={`/catalog/category/${cat.slug}`}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="font-medium text-sm uppercase text-zinc-300 hover:text-brand-500 hover:bg-zinc-900 px-4 py-3 rounded-xl transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <nav className="hidden lg:flex items-center gap-6 font-bold text-sm uppercase text-white">
            <Link href="/rent" className="hover:text-brand-500 transition-colors">Оренда</Link>
            <Link href="/contacts" className="hover:text-brand-500 transition-colors">Контакти</Link>
          </nav>
        </div>

        {/* Logo */}
        <div className="flex-1 flex items-center lg:flex-none lg:absolute lg:left-1/2 lg:-translate-x-1/2 overflow-hidden mr-2">
          <Link href="/" className="flex items-center text-white font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-widest hover:text-brand-500 transition-colors whitespace-nowrap truncate">
            <span>C</span>
            <Coffee className="text-brand-500 mx-1 w-6 h-6 sm:w-6 sm:h-6 lg:w-7 lg:h-7 shrink-0" strokeWidth={3} />
            <span>FFEE</span>
            <span className="ml-1 sm:ml-2 truncate">BROADWAY</span>
          </Link>
        </div>
        
        {/* Right Side: Icons */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 shrink-0">
          <button onClick={() => setIsSearchOpen(true)} className="text-white hover:text-brand-500 transition-colors p-1">
            <Search size={22} />
          </button>
          
          <Link href="/favorites" className="relative text-white hover:text-brand-500 transition-colors p-1">
            <Heart size={22} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link href="/checkout" className="relative text-white hover:text-brand-500 transition-colors p-1">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1 text-white hover:text-brand-500 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed top-24 left-0 w-full h-[calc(100vh-6rem)] bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 transition-all duration-300 z-40 overflow-y-auto ${
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-6 gap-2 pb-24">
          <div className="mb-4">
            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Навігація</h3>
            <div className="flex flex-col border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/50">
              {/* Custom Accordion for Catalog */}
              <details className="group border-b border-zinc-800">
                <summary className="flex items-center justify-between font-bold text-lg text-white p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors list-none">
                  КАТАЛОГ
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="p-4 bg-zinc-950/50 flex flex-col gap-4">
                  {topCategories.map(cat => {
                    const children = subCategories.filter(c => c.parent_id === cat.id);
                    if (children.length === 0) {
                      return (
                        <Link 
                          key={cat.id}
                          href={`/catalog/category/${cat.slug}`} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="font-bold text-brand-500 text-base uppercase block py-2"
                        >
                          {cat.name}
                        </Link>
                      )
                    }
                    return (
                      <details key={cat.id} className="group/sub">
                        <summary className="font-bold text-brand-500 text-base uppercase flex items-center justify-between py-2 cursor-pointer list-none">
                          {cat.name}
                          <span className="transition group-open/sub:rotate-180 text-zinc-500">
                            <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                          </span>
                        </summary>
                        <div className="flex flex-col gap-3 pl-4 mt-2 border-l border-zinc-800 pb-2">
                          <Link 
                            href={`/catalog/category/${cat.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="font-bold text-sm text-white hover:text-brand-500 transition-colors py-1"
                          >
                            Усі товари
                          </Link>
                          {children.map(subCat => (
                            <Link 
                              key={subCat.id} 
                              href={`/catalog/category/${subCat.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="font-medium text-sm text-zinc-400 hover:text-white transition-colors py-1"
                            >
                              {subCat.name}
                            </Link>
                          ))}
                        </div>
                      </details>
                    )
                  })}
                </div>
              </details>
              
              <Link href="/rent" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-lg text-white p-4 hover:bg-zinc-800/50 transition-colors border-b border-zinc-800">ОРЕНДА</Link>
              <Link href="/contacts" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-lg text-white p-4 hover:bg-zinc-800/50 transition-colors">КОНТАКТИ</Link>
            </div>
          </div>
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
