'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSettings } from '@/components/providers/SettingsProvider';
import { useFormStorage } from '@/hooks/useFormStorage';
import { IMaskInput } from "react-imask";

export default function RentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { settings } = useSettings();
  
  const rawOptions = settings?.rental_equipment_options || 'Професійна кавомашина, Професійна кавомолка, Комплект (Кавомашина + Кавомолка), Автоматична кавомашина (для офісу/дому)';
  const equipmentOptions = rawOptions.split(',').map(s => s.trim()).filter(Boolean);

  const [formData, setFormData, clearStorage] = useFormStorage('coffee_rent_form', {
    name: '',
    phone: '',
    equipmentType: equipmentOptions[0] || 'Кавомашина',
    customEquipment: '',
    expectedVolume: ''
  });

  const isOtherSelected = formData.equipmentType.toLowerCase() === 'інше' || formData.equipmentType === 'other';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rental',
          customer_name: formData.name,
          customer_phone: formData.phone,
          details: {
            'Тип обладнання': isOtherSelected ? formData.customEquipment : formData.equipmentType,
            'Очікуваний обсяг (порцій/день)': formData.expectedVolume
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Щось пішло не так');

      setSuccess(true);
      clearStorage();
      setTimeout(() => {
        router.push('/services');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
        <h1 className="text-4xl font-black text-white uppercase mb-6">Заявку <span className="text-brand-500">Прийнято!</span></h1>
        <p className="text-zinc-400 text-lg">Дякуємо! Наш менеджер зв'яжеться з вами найближчим часом для підбору ідеального обладнання.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Side: Image */}
        <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 shrink-0 lg:sticky lg:top-32">
          <Image 
            src="/images/services/rent.png" 
            alt="Оренда кавомашин" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-3xl font-black text-white uppercase mb-2">Преміальна <span className="text-brand-500">Оренда</span></h2>
            <p className="text-zinc-300">Отримайте найкраще обладнання для вашого бізнесу на вигідних умовах.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-4xl font-black text-white uppercase mb-4">Заявка на <span className="text-brand-500">Оренду</span></h1>
          <p className="text-zinc-400 mb-8">Оренда професійного обладнання. Заповніть форму для отримання пропозиції.</p>

          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-zinc-400 font-bold text-sm uppercase mb-2">Ваше ім'я</label>
            <input 
              required
              type="text" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:outline-none transition-colors"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-zinc-400 font-bold text-sm uppercase mb-2">Телефон</label>
            <IMaskInput 
              mask={"+38\\0 (00) 000-00-00"}
              lazy={false}
              required
              placeholder="+380 (__) ___-__-__" 
              value={formData.phone}
              onAccept={(value) => setFormData({...formData, phone: value as string})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 font-bold text-sm uppercase mb-2">Яке обладнання вас цікавить?</label>
          <select 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:outline-none transition-colors"
            value={formData.equipmentType}
            onChange={e => setFormData({...formData, equipmentType: e.target.value})}
          >
            {equipmentOptions.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
            {!equipmentOptions.find(o => o.toLowerCase() === 'інше') && (
              <option value="Інше">Інше (Вказати своє)</option>
            )}
          </select>
        </div>

        {isOtherSelected && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-brand-500 font-bold text-sm uppercase mb-2">Вкажіть ваше обладнання</label>
            <input 
              required
              type="text" 
              className="w-full bg-zinc-950 border border-brand-500/50 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:outline-none transition-colors shadow-[0_0_15px_rgba(255,92,10,0.1)]"
              placeholder="Напишіть варіант..."
              value={formData.customEquipment}
              onChange={e => setFormData({...formData, customEquipment: e.target.value})}
            />
          </div>
        )}

        <div>
          <label className="block text-zinc-400 font-bold text-sm uppercase mb-2">Очікуваний обсяг продажів (чашок в день)</label>
          <input 
            type="text" 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:outline-none transition-colors"
            placeholder="Напр. 100-150"
            value={formData.expectedVolume}
            onChange={e => setFormData({...formData, expectedVolume: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-colors disabled:opacity-50"
        >
          {loading ? 'Відправка...' : 'Надіслати заявку'}
        </button>
          </form>
        </div>
      </div>
    </div>
  );
}
