'use client'

import { useState } from 'react'
import { Save, Wrench, Plus, X } from 'lucide-react'
import { updateServicesSettings } from '../actions'

export default function ServicesSettingsForm({ initialOptions }: { initialOptions: string }) {
  const defaultOptions = 'Професійна кавомашина, Професійна кавомолка, Комплект (Кавомашина + Кавомолка), Автоматична кавомашина (для офісу/дому), Інше'
  
  const initialArray = (initialOptions || defaultOptions)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const [options, setOptions] = useState<string[]>(initialArray.length > 0 ? initialArray : [''])

  const handleAddOption = () => {
    setOptions([...options, ''])
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions.length > 0 ? newOptions : [''])
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const joinedOptions = options.filter(o => o.trim() !== '').join(', ')

  return (
    <form action={updateServicesSettings} className="space-y-8">
      {/* Hidden input to pass to Server Action */}
      <input type="hidden" name="rental_equipment_options" value={joinedOptions} />

      <div className="bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-800">
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-6">
          <div className="bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20 text-orange-500">
            <Wrench size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Оренда Обладнання</h2>
            <p className="text-zinc-400 text-sm">Налаштування дропдауну обладнання для заявки на оренду</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-4">Варіанти обладнання</label>
          
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" 
                  placeholder="Наприклад: Професійна кавомашина"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveOption(index)}
                  className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors shrink-0"
                  title="Видалити варіант"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={handleAddOption}
            className="mt-4 flex items-center gap-2 text-brand-500 hover:text-brand-400 font-medium transition-colors"
          >
            <Plus size={20} />
            <span>Додати ще варіант</span>
          </button>

          <p className="text-xs text-zinc-500 mt-6 pt-4 border-t border-zinc-800/50">Ці опції будуть відображатися у випадаючому списку на сторінці оренди. Користувач зможе обрати один з них. Якщо додати "Інше" або залишити можливість, користувач зможе вписати свій варіант.</p>
        </div>
      </div>

      <div className="sticky bottom-4 pt-4 flex justify-end">
        <button type="submit" className="flex items-center gap-2 bg-brand-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-[0_0_20px_rgba(255,92,10,0.4)]">
          <Save size={20} /> Зберегти налаштування
        </button>
      </div>
    </form>
  )
}
