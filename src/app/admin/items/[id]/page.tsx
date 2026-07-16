import { updateItem } from '../../actions'
import { createClient } from '@/utils/supabase/server'
import { Paperclip } from 'lucide-react'
import { DynamicCharacteristicsInput } from '@/components/admin/DynamicCharacteristicsInput'
import { notFound } from 'next/navigation'

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: item, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !item) {
    return notFound()
  }

  const { data: categories } = await supabase.from('categories').select('id, name, parent_id')

  const topCategories = categories?.filter(c => !c.parent_id) || [];
  const subCategories = categories?.filter(c => c.parent_id) || [];

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black text-white mb-8">Редагування товару</h1>
      
      <form action={updateItem} className="bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-800 space-y-6">
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="current_image_url" value={item.image_urls?.[0] || ''} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Назва товару *</label>
            <input name="name" required type="text" defaultValue={item.name} className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Slug (URL) *</label>
            <input name="slug" required type="text" defaultValue={item.slug} className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Категорія *</label>
            <select name="category_id" required defaultValue={item.category_id} className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors appearance-none">
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
            <input name="price" required type="number" step="0.01" defaultValue={item.price} className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Опис</label>
          <textarea name="description" defaultValue={item.description || ''} className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors min-h-[100px]"></textarea>
        </div>

        {item.image_urls?.[0] && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Поточне фото</label>
            <img src={item.image_urls[0]} alt={item.name} className="w-32 h-32 object-cover rounded-xl border border-zinc-800" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Нова фотографія (опціонально)</label>
          <div className="relative">
            <input name="image_file" type="file" accept="image/*" className="hidden" id="item_image" />
            <label htmlFor="item_image" className="w-full bg-zinc-950 text-zinc-400 border border-zinc-800 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:text-white transition-colors">
              <Paperclip size={28} className="mb-3 text-brand-500" />
              <span className="font-medium">Натисніть, щоб обрати файл (скріпка)</span>
            </label>
          </div>
        </div>

        <DynamicCharacteristicsInput initialCharacteristics={item.characteristics || []} />
        
        <div className="flex items-center gap-3 pt-2">
          <input type="checkbox" name="is_available" id="is_available" defaultChecked={item.is_available} className="w-5 h-5 accent-brand-500 bg-zinc-950 border-zinc-800 rounded cursor-pointer" />
          <label htmlFor="is_available" className="font-medium text-white cursor-pointer">В наявності (показувати в каталозі)</label>
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
