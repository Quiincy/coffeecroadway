import { createClient } from '@/utils/supabase/server'
import { Bot, Save, Phone, MapPin, Share2 } from 'lucide-react'
import { updateSettings } from '../actions'

export default async function SettingsAdmin() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()

  return (
    <div className="max-w-4xl pb-12">
      <h1 className="text-3xl font-black text-white mb-8">Налаштування</h1>
      
      <form action={updateSettings} className="space-y-8">
        
        {/* Telegram Section */}
        <div className="bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-800">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-6">
            <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 text-blue-500">
              <Bot size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Telegram Сповіщення</h2>
              <p className="text-zinc-400 text-sm">Отримуйте повідомлення про нові замовлення прямо в Telegram</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Telegram Bot Token</label>
              <input 
                name="telegram_bot_token" 
                type="text" 
                defaultValue={settings?.telegram_bot_token || ''}
                className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors font-mono text-sm" 
                placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz..." 
              />
              <p className="text-xs text-zinc-500 mt-2">Отримайте токен у <a href="https://t.me/BotFather" target="_blank" className="text-brand-500 hover:underline">@BotFather</a></p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Telegram Chat ID</label>
              <input 
                name="telegram_chat_id" 
                type="text" 
                defaultValue={settings?.telegram_chat_id || ''}
                className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors font-mono text-sm" 
                placeholder="-1001234567890" 
              />
              <p className="text-xs text-zinc-500 mt-2">ID групи або чату</p>
            </div>
          </div>
        </div>

        {/* Contacts Section */}
        <div className="bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-800">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-6">
            <div className="bg-brand-500/10 p-3 rounded-2xl border border-brand-500/20 text-brand-500">
              <Phone size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Контактна інформація</h2>
              <p className="text-zinc-400 text-sm">Ці дані будуть відображатися на сайті</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2"><Phone size={16}/> Номер телефону</label>
              <input 
                name="contact_phone" 
                type="text" 
                defaultValue={settings?.contact_phone || ''}
                className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" 
                placeholder="+380 00 000 00 00" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2"><MapPin size={16}/> Адреса магазину</label>
              <input 
                name="contact_address" 
                type="text" 
                defaultValue={settings?.contact_address || ''}
                className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" 
                placeholder="м. Київ, вул. Кавова, 1" 
              />
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-800">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-6">
            <div className="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20 text-purple-500">
              <Share2 size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Соціальні мережі</h2>
              <p className="text-zinc-400 text-sm">Посилання на ваші сторінки</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                Instagram (URL)
              </label>
              <input 
                name="social_instagram" 
                type="url" 
                defaultValue={settings?.social_instagram || ''}
                className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" 
                placeholder="https://instagram.com/..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook (URL)
              </label>
              <input 
                name="social_facebook" 
                type="url" 
                defaultValue={settings?.social_facebook || ''}
                className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" 
                placeholder="https://facebook.com/..." 
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-4 pt-4 flex justify-end">
          <button type="submit" className="flex items-center gap-2 bg-brand-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-[0_0_20px_rgba(255,92,10,0.4)]">
            <Save size={20} /> Зберегти налаштування
          </button>
        </div>
      </form>
    </div>
  )
}
