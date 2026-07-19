'use client'

import { useCart } from '@/components/providers/CartProvider'
import Link from 'next/link'
import { Trash2, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { IMaskInput } from "react-imask"
import { useFormStorage } from '@/hooks/useFormStorage'

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData, clearStorage] = useFormStorage('coffee_checkout_form', {
    name: "",
    phone: "",
    city: "",
    novaPoshta: "",
    paymentMethod: "card"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          delivery_address: `${formData.city}, НП: ${formData.novaPoshta}`,
          comment: '',
          items: items,
          total_price: totalPrice,
          payment_method: formData.paymentMethod
        })
      });

      const data = await response.json();

      if (data.success) {
        if (formData.paymentMethod === 'card' && data.liqpayUrl) {
          window.location.href = data.liqpayUrl;
        } else {
          setSuccess(true);
          clearCart();
          clearStorage();
        }
      } else {
        alert("Помилка створення замовлення: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Сталася помилка при відправці.");
    } finally {
      setLoading(false);
    }
  }

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

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 max-w-lg mx-auto p-12 rounded-3xl">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">Замовлення прийнято!</h1>
          <p className="text-zinc-400 mb-8">Дякуємо за ваше замовлення. Ми зв'яжемося з вами найближчим часом для підтвердження деталей відправки.</p>
          <Link href="/catalog" className="inline-flex bg-brand-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-[0_0_20px_rgba(255,92,10,0.3)]">
            Повернутися на головну
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
                <div key={item.id} className="flex gap-3 sm:gap-6 items-center bg-zinc-950/50 p-3 sm:p-4 rounded-2xl border border-zinc-800/50">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-zinc-900 rounded-xl overflow-hidden shrink-0 border border-zinc-800">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs sm:text-base">Немає</div>
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-white text-sm sm:text-lg mb-1 leading-tight">{item.name}</h3>
                    <div className="text-brand-500 font-bold text-sm sm:text-base">{item.price.toLocaleString('uk-UA')} ₴</div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 shrink-0">
                    <div className="flex items-center gap-1 sm:gap-2 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors text-sm sm:text-base"
                      >-</button>
                      <span className="w-5 sm:w-6 text-center font-bold text-white text-xs sm:text-base">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors text-sm sm:text-base"
                      >+</button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-1 sm:p-2 text-zinc-500 hover:text-red-500 transition-colors"
                      title="Видалити"
                    >
                      <Trash2 size={18} className="sm:w-5 sm:h-5" />
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
            
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Ім'я та прізвище</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Телефон</label>
                <IMaskInput
                  mask={"+38\\0 (00) 000-00-00"}
                  lazy={false}
                  value={formData.phone}
                  onAccept={(value) => setFormData({...formData, phone: value as string})}
                  placeholder="+380 (__) ___-__-__"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Місто</label>
                <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Відділення Нової Пошти</label>
                <input type="text" value={formData.novaPoshta} onChange={e => setFormData({...formData, novaPoshta: e.target.value})} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2 mt-4">Спосіб оплати</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`cursor-pointer border p-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm ${formData.paymentMethod === 'card' ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-400'}`}>
                    <input type="radio" name="payment" value="card" checked={formData.paymentMethod === 'card'} onChange={() => setFormData({...formData, paymentMethod: 'card'})} className="hidden" />
                    <span>Карткою онлайн</span>
                  </label>
                  <label className={`cursor-pointer border p-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm ${formData.paymentMethod === 'cash' ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-400'}`}>
                    <input type="radio" name="payment" value="cash" checked={formData.paymentMethod === 'cash'} onChange={() => setFormData({...formData, paymentMethod: 'cash'})} className="hidden" />
                    <span>При отриманні</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-6 mt-6 mb-6">
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

              <button disabled={loading} type="submit" className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl hover:bg-brand-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,92,10,0.3)] hover:shadow-[0_0_30px_rgba(255,92,10,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Обробка...' : 'Оплатити замовлення'} <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
