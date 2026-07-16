import Link from 'next/link'
import { Coffee, MapPin, Phone } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function Footer() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()

  const phone = settings?.contact_phone || '+380 00 000 00 00'
  const address = settings?.contact_address || 'Київ, вул. Кавова, 1'
  const instagram = settings?.social_instagram || '#'
  const facebook = settings?.social_facebook || '#'

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <Link href="/" className="flex items-center text-white font-black text-2xl tracking-tight mb-6 whitespace-nowrap hover:text-brand-500 transition-colors">
            <span>C</span>
            <Coffee size={24} className="text-brand-500 mx-1" strokeWidth={3} />
            <span>FFEE</span>
            <span className="ml-2">BROADWAY</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Безкомпромісна якість, темний стиль та справжня кавова енергія. Ми пропонуємо лише найкращий крафт.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Навігація</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><Link href="/catalog" className="hover:text-brand-500 transition-colors">Каталог</Link></li>
            <li><Link href="/contacts" className="hover:text-brand-500 transition-colors">Контакти</Link></li>
            <li><Link href="/checkout" className="hover:text-brand-500 transition-colors">Кошик</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Зв'язок</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-center gap-3">
              <div className="bg-zinc-900 p-2 rounded-lg text-brand-500">
                <Phone size={16} />
              </div>
              <span>{phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-zinc-900 p-2 rounded-lg text-brand-500">
                <MapPin size={16} />
              </div>
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-zinc-900 p-2 rounded-lg text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
              <a href={instagram} target="_blank" rel="noreferrer" className="group-hover:text-white transition-colors">Instagram</a>
            </li>
            <li className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-zinc-900 p-2 rounded-lg text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <a href={facebook} target="_blank" rel="noreferrer" className="group-hover:text-white transition-colors">Facebook</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-zinc-900 text-sm text-center text-zinc-600 font-medium tracking-wide">
        &copy; {new Date().getFullYear()} Coffee Broadway. Всі права захищені.
      </div>
    </footer>
  )
}
