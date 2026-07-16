'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Coffee, Package, Tags, Menu, X, MessageSquare } from 'lucide-react'

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Header for Admin */}
      <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-2 text-white font-bold text-xl">
          <Coffee size={24} className="text-brand-500" />
          <span>Broadway</span>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 hover:text-white p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-[100dvh] bg-zinc-900 border-r border-zinc-800 flex flex-col 
        transition-transform duration-300 z-40 w-64 pt-[72px] md:pt-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:block">
          <Link href="/admin" className="flex items-center gap-2 text-white font-bold text-xl hover:text-brand-500 transition-colors">
            <Coffee size={24} className="text-brand-500" />
            <span>Broadway Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <Link onClick={() => setIsOpen(false)} href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <LayoutDashboard size={20} />
            Дашборд
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ShoppingBag size={20} />
            Замовлення
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/admin/items" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <Package size={20} />
            Товари
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <Tags size={20} />
            Категорії
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/admin/reviews" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <MessageSquare size={20} />
            Відгуки
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <Settings size={20} />
            Налаштування
          </Link>
        </nav>
        
        <div className="p-4 border-t border-zinc-800">
          <Link onClick={() => setIsOpen(false)} href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <LogOut size={20} />
            Вийти на сайт
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
