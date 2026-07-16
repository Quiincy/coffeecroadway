import { createClient } from '@/utils/supabase/server'
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Fetch some quick stats
  const { count: itemsCount } = await supabase.from('items').select('*', { count: 'exact', head: true })
  
  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-8">Дашборд</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { title: 'Дохід за місяць', value: '0 ₴', icon: <DollarSign size={20} className="md:w-6 md:h-6" />, color: 'text-brand-500' },
          { title: 'Замовлень', value: '0', icon: <ShoppingBag size={20} className="md:w-6 md:h-6" />, color: 'text-blue-500' },
          { title: 'Клієнтів', value: '0', icon: <Users size={20} className="md:w-6 md:h-6" />, color: 'text-green-500' },
          { title: 'Всього товарів', value: itemsCount || '0', icon: <Package size={20} className="md:w-6 md:h-6" />, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 rounded-3xl p-4 md:p-6 shadow-sm border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className={stat.color}>{stat.icon}</div>
              </div>
            </div>
            <h3 className="text-zinc-400 font-medium mb-1 text-xs md:text-base leading-tight">{stat.title}</h3>
            <p className="text-xl md:text-3xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 rounded-3xl shadow-sm border border-zinc-800 p-8">
        <h2 className="text-xl font-bold text-white mb-6">Останні замовлення</h2>
        <div className="text-center py-12 text-zinc-500 font-medium">
          Тут будуть відображатися останні замовлення
        </div>
      </div>
    </div>
  )
}
