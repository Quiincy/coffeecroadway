import { createCategory } from '../../actions'
import { createClient } from '@/utils/supabase/server'
import { Paperclip } from 'lucide-react'
import { FormAutoSaver } from '@/components/admin/FormAutoSaver'

export default async function NewCategoryPage() {
  const supabase = await createClient()
  // Fetch top-level categories only (to avoid deep nesting for now)
  const { data: topCategories } = await supabase
    .from('categories')
    .select('id, name')
    .is('parent_id', null)

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black text-white mb-8">Нова категорія</h1>
      
      <form id="new-category-form" action={createCategory} className="bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-800 space-y-6">
        <FormAutoSaver formId="new-category-form" />
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Назва категорії *</label>
          <input name="name" required type="text" className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" placeholder="Кава в зернах" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Батьківська категорія</label>
          <select name="parent_id" className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors appearance-none">
            <option value="">Немає (це головна категорія)</option>
            {topCategories?.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Slug (URL) *</label>
          <input name="slug" required type="text" className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" placeholder="coffee-beans" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Опис</label>
          <textarea name="description" className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors min-h-[100px]"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Фотографія категорії</label>
          <div className="relative">
            <input name="image_file" type="file" accept="image/*" className="hidden" id="category_image" />
            <label htmlFor="category_image" className="w-full bg-zinc-950 text-zinc-400 border border-zinc-800 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:text-white transition-colors">
              <Paperclip size={28} className="mb-3 text-brand-500" />
              <span className="font-medium">Натисніть, щоб обрати файл (скріпка)</span>
              <span className="text-xs mt-1 opacity-70 text-zinc-500">Підтримуються PNG, JPG, WEBP (до 5MB)</span>
            </label>
          </div>
        </div>
        
        <div className="pt-6 flex justify-end border-t border-zinc-800 mt-6">
          <button type="submit" className="bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(255,92,10,0.3)]">
            Зберегти категорію
          </button>
        </div>
      </form>
    </div>
  )
}
