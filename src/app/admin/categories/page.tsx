import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function CategoriesAdmin() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('created_at', { ascending: true })

  // Organize categories hierarchically
  const topCategories = categories?.filter(c => !c.parent_id) || [];
  const subCategories = categories?.filter(c => c.parent_id) || [];

  const organizedCategories: any[] = [];
  topCategories.forEach(parent => {
    organizedCategories.push({ ...parent, isSub: false });
    const children = subCategories.filter(c => c.parent_id === parent.id);
    children.forEach(child => {
      organizedCategories.push({ ...child, isSub: true, parentName: parent.name });
    });
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white">Категорії</h1>
        <Link href="/admin/categories/new" className="flex items-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(255,92,10,0.3)]">
          <Plus size={20} /> Додати категорію
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-3xl shadow-sm border border-zinc-800 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium text-zinc-400">Назва</th>
                <th className="px-6 py-4 font-medium text-zinc-400">Slug</th>
                <th className="px-6 py-4 font-medium text-zinc-400">Дата створення</th>
                <th className="px-6 py-4 font-medium text-zinc-400 text-right">Дії</th>
              </tr>
            </thead>
            <tbody>
              {organizedCategories && organizedCategories.length > 0 ? (
                organizedCategories.map(cat => (
                  <tr key={cat.id} className={`border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors ${cat.isSub ? 'bg-zinc-900/50' : ''}`}>
                    <td className={`px-6 py-4 font-bold ${cat.isSub ? 'text-zinc-300 pl-12' : 'text-white'}`}>
                      {cat.isSub && <span className="text-zinc-600 mr-2 text-xl leading-none">↳</span>}
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{cat.slug}</td>
                    <td className="px-6 py-4 text-zinc-400">{new Date(cat.created_at).toLocaleDateString('uk-UA')}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/categories/${cat.id}`} className="text-zinc-400 hover:text-brand-500 transition-colors">
                          Редагувати
                        </Link>
                        <form action={async () => {
                          'use server';
                          const { deleteCategory } = await import('@/app/admin/actions');
                          await deleteCategory(cat.id);
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
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500 font-medium">Немає категорій</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col">
          {organizedCategories && organizedCategories.length > 0 ? (
            organizedCategories.map(cat => (
              <div key={cat.id} className={`p-5 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors ${cat.isSub ? 'pl-10 border-l-4 border-l-brand-500/50 bg-zinc-900/50' : ''}`}>
                <h3 className={`font-bold text-lg mb-1 ${cat.isSub ? 'text-zinc-300' : 'text-white'}`}>{cat.name}</h3>
                <div className="text-brand-500 text-sm font-medium mb-3">/{cat.slug}</div>
                <div className="text-zinc-500 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span>Додано:</span>
                    <span className="text-zinc-400">{new Date(cat.created_at).toLocaleDateString('uk-UA')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/categories/${cat.id}`} className="text-zinc-400 hover:text-brand-500 transition-colors">
                      Редагувати
                    </Link>
                    <form action={async () => {
                      'use server';
                      const { deleteCategory } = await import('@/app/admin/actions');
                      await deleteCategory(cat.id);
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
            <div className="p-8 text-center text-zinc-500 font-medium">Немає категорій</div>
          )}
        </div>
      </div>
    </div>
  )
}
