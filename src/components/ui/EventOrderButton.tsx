"use client";
import React, { useState } from "react";
import { useFormStorage } from "@/hooks/useFormStorage";
import { IMaskInput } from "react-imask";

export const EventOrderButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData, clearStorage] = useFormStorage('coffee_event_form', { name: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'event',
          customer_name: formData.name,
          customer_phone: formData.phone,
          details: {}
        })
      });

      if (!res.ok) throw new Error('Помилка');
      
      setSuccess(true);
      clearStorage();
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      alert("Сталася помилка. Спробуйте пізніше.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-md transition-colors font-medium shadow-md hover:shadow-lg"
      >
        Замовити баристу
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl transition-colors"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">Замовити баристу для вашого свята</h2>
            
            {success ? (
              <div className="py-8 text-center">
                <p className="text-xl font-bold text-brand-500 mb-2">Заявку прийнято!</p>
                <p className="text-zinc-400">Ми зв'яжемося з вами найближчим часом.</p>
              </div>
            ) : (
              <>
                <p className="text-zinc-400 mb-6 text-sm">Залиште ваші дані, і ми зв'яжемося з вами для обговорення деталей.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Ваше ім'я</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Олександр" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Номер телефону</label>
                    <IMaskInput 
                      mask={"+38\\0 (00) 000-00-00"}
                      lazy={false}
                      required
                      placeholder="+380 (__) ___-__-__" 
                      value={formData.phone}
                      onAccept={(value) => setFormData({ ...formData, phone: value as string })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white rounded-lg py-3 mt-2 transition-colors font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Відправка...' : 'Відправити заявку'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
