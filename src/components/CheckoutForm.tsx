"use client";
import React, { useState } from "react";
import { IMaskInput } from "react-imask";
import { useCart } from "@/components/providers/CartProvider";

interface CheckoutFormProps {
  items: any[];
  totalPrice: number;
}

export const CheckoutForm = ({ items, totalPrice }: CheckoutFormProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    comment: "",
    paymentMethod: "card"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          delivery_address: formData.address,
          comment: formData.comment,
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
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Замовлення прийнято!</h3>
        <p className="text-zinc-400">Ми зв'яжемося з вами найближчим часом для підтвердження.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Ім'я</label>
        <input 
          required
          type="text" 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 focus:outline-none focus:border-brand-500 transition-colors"
          placeholder="Олександр"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Телефон</label>
        <IMaskInput
          mask="+{380} (00) 000-00-00"
          value={formData.phone}
          unmask={true} 
          onAccept={(value) => setFormData({...formData, phone: value})}
          placeholder="+380 (__) ___-__-__"
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 focus:outline-none focus:border-brand-500 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Адреса доставки</label>
        <input 
          required
          type="text" 
          value={formData.address}
          onChange={e => setFormData({...formData, address: e.target.value})}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 focus:outline-none focus:border-brand-500 transition-colors"
          placeholder="Вул. Хрещатик, 1, кв 12"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Коментар до замовлення</label>
        <textarea 
          value={formData.comment}
          onChange={e => setFormData({...formData, comment: e.target.value})}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 focus:outline-none focus:border-brand-500 transition-colors h-24 resize-none"
          placeholder="Не дзвонити у двері..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">Спосіб оплати</label>
        <div className="grid grid-cols-2 gap-3">
          <label className={`cursor-pointer border p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${formData.paymentMethod === 'card' ? 'border-brand-500 bg-brand-500/10' : 'border-zinc-700 bg-zinc-800'}`}>
            <input type="radio" name="payment" value="card" checked={formData.paymentMethod === 'card'} onChange={() => setFormData({...formData, paymentMethod: 'card'})} className="hidden" />
            <span>Карткою онлайн</span>
          </label>
          <label className={`cursor-pointer border p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${formData.paymentMethod === 'cash' ? 'border-brand-500 bg-brand-500/10' : 'border-zinc-700 bg-zinc-800'}`}>
            <input type="radio" name="payment" value="cash" checked={formData.paymentMethod === 'cash'} onChange={() => setFormData({...formData, paymentMethod: 'cash'})} className="hidden" />
            <span>Готівкою</span>
          </label>
        </div>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-lg transition-colors mt-4"
      >
        {loading ? 'Оформлення...' : 'Оформити замовлення'}
      </button>
    </form>
  );
};
