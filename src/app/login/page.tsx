import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const error = (await searchParams).error

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-3xl border border-zinc-800 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-2 text-center tracking-tight">ВХІД</h1>
        <p className="text-zinc-400 text-center mb-8 font-medium">Для доступу до адмін-панелі</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" 
              placeholder="admin@coffeebroadway.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Пароль</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" 
              placeholder="••••••••" 
            />
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(255,92,10,0.3)]"
            >
              Увійти
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
