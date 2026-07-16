import { createClient } from '@/utils/supabase/server'
import { RealtimeOrders } from '@/components/admin/RealtimeOrders'

export default async function OrdersAdmin() {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white">Замовлення</h1>
      </div>
      <RealtimeOrders initialOrders={orders || []} />
    </div>
  )
}

