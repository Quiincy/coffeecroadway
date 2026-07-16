import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function ItemsAdmin() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('items').select(`*, category:categories(name)`).order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white">Товари</h1>
        <Link href="/admin/items/new" className="flex items-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(255,92,10,0.3)]">
          <Plus size={20} /> Додати товар
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-3xl shadow-sm border border-zinc-800 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium text-zinc-400">Назва</th>
                <th className="px-6 py-4 font-medium text-zinc-400">Категорія</th>
                <th className="px-6 py-4 font-medium text-zinc-400">Ціна</th>
                <th className="px-6 py-4 font-medium text-zinc-400">Статус</th>
                <th className="px-6 py-4 font-medium text-zinc-400 text-right">Дії</th>
              </tr>
            </thead>
            <tbody>
              {items && items.length > 0 ? (
                items.map(item => (
                  <tr key={item.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{item.name}</td>
                    {/* @ts-ignore */}
                    <td className="px-6 py-4 text-zinc-400">{item.category?.name}</td>
                    <td className="px-6 py-4 text-zinc-400 font-medium">{item.price} ₴</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.is_available ? 'bg-brand-500/20 text-brand-500 border border-brand-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                        {item.is_available ? 'В наявності' : 'Сховано'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/items/${item.id}`} className="text-zinc-400 hover:text-brand-500 transition-colors">
                          Редагувати
                        </Link>
                        <form action={async () => {
                          'use server';
                          const { deleteItem } = await import('@/app/admin/actions');
                          await deleteItem(item.id);
                        }}>
                          <button type="submit" className="text-zinc-500 hover:text-red-500 transition-colors" title="Видалити">
                            Видалити
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500 font-medium">Немає товарів</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col">
          {items && items.length > 0 ? (
            items.map(item => (
              <div key={item.id} className="p-5 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="font-bold text-white text-lg leading-tight">{item.name}</h3>
                  <span className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-bold ${item.is_available ? 'bg-brand-500/20 text-brand-500 border border-brand-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {item.is_available ? 'В наявності' : 'Сховано'}
                  </span>
                </div>
                {/* @ts-ignore */}
                <div className="text-zinc-400 text-sm mb-3">{item.category?.name}</div>
                <div className="flex items-center justify-between">
                  <div className="font-black text-white text-xl">{item.price} ₴</div>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/items/${item.id}`} className="text-zinc-400 hover:text-brand-500 transition-colors">
                      Редагувати
                    </Link>
                    <form action={async () => {
                      'use server';
                      const { deleteItem } = await import('@/app/admin/actions');
                      await deleteItem(item.id);
                    }}>
                      <button type="submit" className="text-zinc-500 hover:text-red-500 transition-colors" title="Видалити">
                        Видалити
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500 font-medium">Немає товарів</div>
          )}
        </div>
      </div>
    </div>
  )
}
