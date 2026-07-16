'use client'

import { useCart } from '@/components/providers/CartProvider'
import Link from 'next/link'
import { Trash2, ArrowLeft, ArrowRight } from 'lucide-react'

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 max-w-lg mx-auto p-12 rounded-3xl">
          <div className="text-6xl mb-6 opacity-50">🛒</div>
          <h1 className="text-3xl font-black text-white mb-4">Кошик порожній</h1>
          <p className="text-zinc-400 mb-8">Схоже, ви ще нічого не додали до кошика.</p>
          <Link href="/catalog" className="inline-flex bg-brand-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-[0_0_20px_rgba(255,92,10,0.3)]">
            Перейти до каталогу
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/catalog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-500 transition-colors font-medium mb-8">
        <ArrowLeft size={20} /> Продовжити покупки
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Замовлення */}
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-black text-white mb-8 tracking-tight">ОФОРМЛЕННЯ <span className="text-brand-500">ЗАМОВЛЕННЯ</span></h1>
          
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-4">Ваш кошик ({totalItems})</h2>
            
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 sm:gap-6 items-center bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-900 rounded-xl overflow-hidden shrink-0 border border-zinc-800">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">Немає</div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-white sm:text-lg mb-1 line-clamp-1">{item.name}</h3>
                    <div className="text-brand-500 font-bold">{item.price.toLocaleString('uk-UA')} ₴</div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                      >-</button>
                      <span className="w-6 text-center font-bold text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                      >+</button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                      title="Видалити"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Форма доставки та оплати */}
        <div className="lg:w-1/3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sticky top-28 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-6">Дані доставки</h2>
            
            <form className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Ім'я та прізвище</label>
                <input type="text" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Телефон</label>
                <input type="tel" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" placeholder="+380" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Місто</label>
                <input type="text" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Відділення Нової Пошти</label>
                <input type="text" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
              </div>
            </form>

            <div className="border-t border-zinc-800 pt-6 mb-6">
              <div className="flex justify-between text-zinc-400 mb-2">
                <span>Товари ({totalItems}):</span>
                <span>{totalPrice.toLocaleString('uk-UA')} ₴</span>
              </div>
              <div className="flex justify-between text-zinc-400 mb-4">
                <span>Доставка:</span>
                <span>За тарифами НП</span>
              </div>
              <div className="flex justify-between items-end border-t border-zinc-800 pt-4 mt-4">
                <span className="text-lg font-medium text-white">До сплати:</span>
                <span className="text-3xl font-black text-brand-500">{totalPrice.toLocaleString('uk-UA')} ₴</span>
              </div>
            </div>

            <button className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl hover:bg-brand-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,92,10,0.3)] hover:shadow-[0_0_30px_rgba(255,92,10,0.5)]">
              Оплатити замовлення <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
