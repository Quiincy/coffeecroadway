import { createClient } from '@/utils/supabase/server'
import ServicesSettingsForm from './ServicesSettingsForm'

export default async function ServicesAdmin() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()

  return (
    <div className="max-w-4xl pb-12">
      <h1 className="text-3xl font-black text-white mb-8">Наші послуги</h1>
      
      <ServicesSettingsForm initialOptions={settings?.rental_equipment_options || ''} />
    </div>
  )
}
