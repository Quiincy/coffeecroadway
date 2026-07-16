import { createClient } from '@/utils/supabase/server'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import MapClient from '@/components/ui/MapClient'

export const revalidate = 60 // 1 minute

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()

  const contactsInfo = {
    phone: settings?.contact_phone || '+380 00 000 00 00',
    email: 'hello@coffeebroadway.com',
    address: settings?.contact_address || 'м. Київ, вул. Кавова, 1',
    workingHours: 'Пн-Нд: 09:00 - 20:00',
    instagram: settings?.social_instagram || '#',
    facebook: settings?.social_facebook || '#'
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">НАШІ <span className="text-brand-500">КОНТАКТИ</span></h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Завжди раді вас бачити! Завітайте до нас на каву або зв'яжіться будь-яким зручним способом.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="space-y-8">
          <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6">Зв'язок з нами</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-zinc-900 p-3 rounded-xl text-brand-500">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Телефон</h3>
                  <p className="text-zinc-400 text-lg">{contactsInfo.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-zinc-900 p-3 rounded-xl text-brand-500">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Email</h3>
                  <p className="text-zinc-400 text-lg">{contactsInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-zinc-900 p-3 rounded-xl text-brand-500">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Години роботи</h3>
                  <p className="text-zinc-400 text-lg">{contactsInfo.workingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-zinc-900 p-3 rounded-xl text-brand-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Адреса</h3>
                  <p className="text-zinc-400 text-lg">{contactsInfo.address}</p>
                </div>
              </div>
              
              <div className="pt-4 mt-6 border-t border-zinc-800">
                <h3 className="font-bold text-white mb-4">Ми в соціальних мережах</h3>
                <div className="flex gap-4">
                  <a href={contactsInfo.instagram} target="_blank" className="bg-zinc-900 p-3 rounded-xl text-brand-500 hover:bg-brand-500 hover:text-white transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href={contactsInfo.facebook} target="_blank" className="bg-zinc-900 p-3 rounded-xl text-brand-500 hover:bg-brand-500 hover:text-white transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(255,92,10,0.1)] border border-zinc-800 h-[400px] md:h-auto">
          <MapClient />
        </div>
      </div>
    </div>
  )
}
