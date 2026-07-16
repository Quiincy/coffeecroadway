import { updateCategory } from '../../actions'
import { createClient } from '@/utils/supabase/server'
import { Paperclip } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  // Fetch the category to edit
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !category) {
    return notFound()
  }

  // Fetch top-level categories only (to avoid deep nesting for now)
  const { data: topCategories } = await supabase
    .from('categories')
    .select('id, name')
    .is('parent_id', null)
    .neq('id', id) // A category cannot be its own parent

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black text-white mb-8">Редагування категорії</h1>
      
      <form action={updateCategory} className="bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-800 space-y-6">
        <input type="hidden" name="id" value={category.id} />
        <input type="hidden" name="current_image_url" value={category.image_url || ''} />

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Назва категорії *</label>
          <input name="name" required type="text" defaultValue={category.name} className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" placeholder="Кава в зернах" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Батьківська категорія</label>
          <select name="parent_id" defaultValue={category.parent_id || ""} className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors appearance-none">
            <option value="">Немає (це головна категорія)</option>
            {topCategories?.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Slug (URL) *</label>
          <input name="slug" required type="text" defaultValue={category.slug} className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" placeholder="coffee-beans" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Опис</label>
          <textarea name="description" defaultValue={category.description || ''} className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors min-h-[100px]"></textarea>
        </div>
        
        {category.image_url && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Поточне фото</label>
            <img src={category.image_url} alt={category.name} className="w-32 h-32 object-cover rounded-xl border border-zinc-800" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Нова фотографія (опціонально)</label>
          <div className="relative">
            <input name="image_file" type="file" accept="image/*" className="hidden" id="category_image" />
            <label htmlFor="category_image" className="w-full bg-zinc-950 text-zinc-400 border border-zinc-800 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:text-white transition-colors">
              <Paperclip size={28} className="mb-3 text-brand-500" />
              <span className="font-medium">Натисніть, щоб обрати файл</span>
            </label>
          </div>
        </div>
        
        <div className="pt-6 flex justify-end border-t border-zinc-800 mt-6">
          <button type="submit" className="bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(255,92,10,0.3)]">
            Зберегти зміни
          </button>
        </div>
      </form>
    </div>
  )
}
