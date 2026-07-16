'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Filter, Grid, List, ArrowUpDown, RefreshCw, Check, X } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import { useCompare } from '@/components/providers/CompareProvider'

interface CatalogClientProps {
  items: any[]
  categories: any[]
  currentCategory?: any
}

export default function CatalogClient({ items, categories, currentCategory }: CatalogClientProps) {
  const { compareItems } = useCompare()
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest') // newest, price_asc, price_desc
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([])

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Extract unique brands and purposes from items characteristics dynamically
  const availableBrands = useMemo(() => {
    const brands = new Set<string>()
    items.forEach(item => {
      item.characteristics?.forEach((c: any) => {
        if (c.name.toLowerCase().includes('бренд')) brands.add(c.value)
      })
    })
    return Array.from(brands)
  }, [items])

  const availablePurposes = useMemo(() => {
    const purposes = new Set<string>()
    items.forEach(item => {
      item.characteristics?.forEach((c: any) => {
        if (c.name.toLowerCase().includes('призначення')) purposes.add(c.value)
      })
    })
    return Array.from(purposes)
  }, [items])

  // Get max price
  useMemo(() => {
    if (items.length > 0) {
      const max = Math.max(...items.map(i => i.price))
      setPriceRange([0, max])
    }
  }, [items])

  // Filter and Sort logic
  const filteredItems = useMemo(() => {
    let result = [...items]

    // Price
    result = result.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1])

    // Brands
    if (selectedBrands.length > 0) {
      result = result.filter(item => {
        const itemBrand = item.characteristics?.find((c: any) => c.name.toLowerCase().includes('бренд'))?.value
        return itemBrand && selectedBrands.includes(itemBrand)
      })
    }

    // Purposes
    if (selectedPurposes.length > 0) {
      result = result.filter(item => {
        const itemPurpose = item.characteristics?.find((c: any) => c.name.toLowerCase().includes('призначення'))?.value
        return itemPurpose && selectedPurposes.includes(itemPurpose)
      })
    }

    // Sorting
    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return result
  }, [items, priceRange, selectedBrands, selectedPurposes, sortBy])

  const toggleBrand = (b: string) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])
  const togglePurpose = (p: string) => setSelectedPurposes(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  const resetFilters = () => {
    setPriceRange([0, Math.max(...items.map(i => i.price), 50000)])
    setSelectedBrands([])
    setSelectedPurposes([])
  }

  // Hierarchy
  const hierarchy = []
  if (currentCategory) {
    let cat = currentCategory
    while (cat) {
      hierarchy.unshift(cat)
      cat = categories.find(c => c.id === cat.parent_id)
    }
  }

  return (
    <div className="container mx-auto px-4 py-3 lg:py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap gap-1 lg:gap-2 text-xs lg:text-sm font-medium text-zinc-500 mb-3 lg:mb-6">
        <Link href="/" className="hover:text-brand-500 transition-colors">Головна</Link>
        {hierarchy.length === 0 && (
          <>
            <span>&gt;</span>
            <span className="text-zinc-300">Каталог</span>
          </>
        )}
        {hierarchy.map((cat, index) => (
          <React.Fragment key={cat.id}>
            <span>&gt;</span>
            {index === hierarchy.length - 1 ? (
              <span className="text-zinc-300">{cat.name}</span>
            ) : (
              <Link href={`/catalog/category/${cat.slug}`} className="hover:text-brand-500 transition-colors">
                {cat.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-white mb-4 lg:mb-8 uppercase tracking-tight">
        {currentCategory ? currentCategory.name : 'Каталог'}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Mobile Overlay */}
        {isFiltersOpen && (
          <div 
            className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsFiltersOpen(false)}
          />
        )}

        {/* Sidebar Filters */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-full max-w-[300px] bg-zinc-950 lg:bg-transparent transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-72 lg:z-auto flex flex-col ${isFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="bg-zinc-950 lg:bg-zinc-900/50 lg:border lg:border-zinc-800 lg:rounded-2xl p-6 lg:sticky lg:top-28 flex-1 flex flex-col h-full lg:h-auto overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                <Filter size={18} className="text-brand-500" />
                Фільтри
              </h2>
              <button 
                className="lg:hidden text-zinc-500 hover:text-white transition-colors"
                onClick={() => setIsFiltersOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Filters Area on mobile */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-none">
              {/* Price Filter */}
              <div className="mb-8">
                <label className="text-sm font-medium text-zinc-400 mb-3 block">Ціна (грн)</label>
                <div className="flex items-center justify-between text-sm font-bold text-white mb-2">
                  <span>{priceRange[0]}</span>
                  <span>{priceRange[1]}</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={Math.max(...items.map(i => i.price), 50000)}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-brand-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Purposes Filter */}
              {availablePurposes.length > 0 && (
                <div className="mb-8">
                  <label className="text-sm font-medium text-zinc-400 mb-3 block">Призначення</label>
                  <div className="space-y-3">
                    {availablePurposes.map(purpose => (
                      <div key={purpose} className="flex items-center justify-between cursor-pointer group" onClick={() => togglePurpose(purpose)}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedPurposes.includes(purpose) ? 'bg-brand-500 border-brand-500 text-white' : 'border-zinc-700 bg-zinc-950 group-hover:border-brand-500'}`}>
                            {selectedPurposes.includes(purpose) && <Check size={14} />}
                          </div>
                          <span className="text-zinc-300 group-hover:text-white transition-colors text-sm">{purpose}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands Filter */}
              {availableBrands.length > 0 && (
                <div className="mb-8">
                  <label className="text-sm font-medium text-zinc-400 mb-3 block">Бренд</label>
                  <div className="space-y-3">
                    {availableBrands.map(brand => (
                      <div key={brand} className="flex items-center justify-between cursor-pointer group" onClick={() => toggleBrand(brand)}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedBrands.includes(brand) ? 'bg-brand-500 border-brand-500 text-white' : 'border-zinc-700 bg-zinc-950 group-hover:border-brand-500'}`}>
                            {selectedBrands.includes(brand) && <Check size={14} />}
                          </div>
                          <span className="text-zinc-300 group-hover:text-white transition-colors text-sm">{brand}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-8 pt-4 border-t border-zinc-800 lg:border-none lg:pt-0 lg:mt-8">
              <button onClick={resetFilters} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                Скинути
              </button>
              <button 
                onClick={() => setIsFiltersOpen(false)}
                className="flex-1 bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-[0_0_15px_rgba(255,92,10,0.3)]"
              >
                Застосувати
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Toolbar */}
          <div className="flex flex-row items-center justify-between gap-2 lg:gap-4 mb-4 lg:mb-6 bg-zinc-900/30 p-2 rounded-2xl border border-zinc-800/50">
            <Link 
              href="/compare" 
              className="relative flex items-center justify-center p-2 lg:px-4 rounded-xl text-brand-500 bg-zinc-900 border border-zinc-800 hover:border-brand-500 transition-colors shrink-0"
              title="Порівняння товарів"
            >
              <RefreshCw size={18} />
              <span className="hidden lg:inline ml-2 font-medium">Порівняння ({compareItems.length})</span>
              {compareItems.length > 0 && (
                <span className="lg:hidden absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {compareItems.length}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2 flex-1 justify-end">
              {/* Mobile Filter Button */}
              <button 
                onClick={() => setIsFiltersOpen(true)}
                className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-1 border border-zinc-800 bg-zinc-900 rounded-xl px-2 py-2 text-[11px] sm:text-sm font-bold text-white hover:border-zinc-700 transition-colors"
              >
                <Filter size={14} className="sm:w-4 sm:h-4" />
                ФІЛЬТРИ
              </button>

              <div className="relative border border-zinc-800 bg-zinc-900 rounded-xl px-2 sm:px-4 py-2 flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm font-bold text-white hover:border-zinc-700 transition-colors cursor-pointer flex-1 sm:flex-none justify-center sm:justify-start overflow-hidden">
                <ArrowUpDown size={14} className="text-white sm:text-zinc-400 sm:w-4 sm:h-4" />
                <span className="text-zinc-400 hidden sm:inline font-medium">Сортувати:</span>
                <span className="sm:hidden uppercase tracking-wider">Сортувати</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer sm:relative sm:inset-auto sm:opacity-100 sm:bg-transparent sm:outline-none sm:appearance-none sm:w-auto sm:pr-4 sm:font-medium"
                >
                  <option value="newest" className="bg-zinc-900 text-black sm:text-white">Новинки</option>
                  <option value="price_asc" className="bg-zinc-900 text-black sm:text-white">Від дешевих</option>
                  <option value="price_desc" className="bg-zinc-900 text-black sm:text-white">Від дорогих</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center p-1 bg-zinc-900 rounded-xl border border-zinc-800 shrink-0">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  <Grid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
              <div className="text-4xl mb-4 opacity-50">🔍</div>
              <h2 className="text-xl font-bold text-white mb-2">Нічого не знайдено</h2>
              <p className="text-zinc-500">Спробуйте змінити критерії пошуку або скинути фільтри.</p>
            </div>
          ) : (
            <div className={`grid gap-3 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredItems.map(item => (
                <ProductCard key={item.id} item={item} listMode={viewMode === 'list'} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
