import { createItem } from '../../actions'
import { createClient } from '@/utils/supabase/server'
import { Paperclip } from 'lucide-react'
import { DynamicCharacteristicsInput } from '@/components/admin/DynamicCharacteristicsInput'
import { FormAutoSaver } from '@/components/admin/FormAutoSaver'

export default async function NewItemPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('id, name, parent_id')

  const topCategories = categories?.filter(c => !c.parent_id) || [];
  const subCategories = categories?.filter(c => c.parent_id) || [];

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black text-white mb-8">Новий товар</h1>
      
      <form id="new-item-form" action={createItem} className="bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-800 space-y-6">
        <FormAutoSaver formId="new-item-form" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Назва товару *</label>
            <input name="name" required type="text" className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Slug (URL) *</label>
            <input name="slug" required type="text" className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Категорія *</label>
            <select name="category_id" required className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors appearance-none">
              <option value="">Оберіть категорію...</option>
              {topCategories.map(topCat => {
                const children = subCategories.filter(c => c.parent_id === topCat.id);
                return (
                  <optgroup key={topCat.id} label={topCat.name}>
                    <option value={topCat.id}>{topCat.name} (Головна)</option>
                    {children.map(child => (
                      <option key={child.id} value={child.id}>↳ {child.name}</option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Ціна (₴) *</label>
            <input name="price" required type="number" step="0.01" className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Опис</label>
          <textarea name="description" className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors min-h-[100px]"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Фотографія товару</label>
          <div className="relative">
            <input name="image_file" type="file" accept="image/*" className="hidden" id="item_image" />
            <label htmlFor="item_image" className="w-full bg-zinc-950 text-zinc-400 border border-zinc-800 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:text-white transition-colors">
              <Paperclip size={28} className="mb-3 text-brand-500" />
              <span className="font-medium">Натисніть, щоб обрати файл (скріпка)</span>
              <span className="text-xs mt-1 opacity-70 text-zinc-500">Підтримуються PNG, JPG, WEBP (до 5MB)</span>
            </label>
          </div>
        </div>

        <DynamicCharacteristicsInput />
        
        <div className="flex items-center gap-3 pt-2">
          <input type="checkbox" name="is_available" id="is_available" defaultChecked className="w-5 h-5 accent-brand-500 bg-zinc-950 border-zinc-800 rounded cursor-pointer" />
          <label htmlFor="is_available" className="font-medium text-white cursor-pointer">В наявності (показувати в каталозі)</label>
        </div>

        <div className="pt-6 flex justify-end border-t border-zinc-800 mt-6">
          <button type="submit" className="bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(255,92,10,0.3)]">
            Зберегти товар
          </button>
        </div>
      </form>
    </div>
  )
}
