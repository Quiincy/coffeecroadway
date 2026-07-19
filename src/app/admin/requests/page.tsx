import { createClient } from '@/utils/supabase/server'
import { RequestsDashboard } from '@/components/admin/RequestsDashboard'

export const dynamic = 'force-dynamic'

export default async function RequestsAdmin() {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: serviceRequests } = await supabase
    .from('service_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white">Управління Заявками</h1>
      </div>
      <RequestsDashboard 
        initialOrders={orders || []} 
        initialServiceRequests={serviceRequests || []} 
      />
    </div>
  )
}
