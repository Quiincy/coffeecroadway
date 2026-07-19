import Link from 'next/link';
import Image from 'next/image';
import { Settings, Coffee, Wrench, Users } from 'lucide-react';
import { EventOrderButton } from '@/components/ui/EventOrderButton';

export const metadata = {
  title: 'Послуги - Coffee Broadway',
  description: 'Послуги компанії Coffee Broadway: ремонт, оренда та обслуговування кавомашин.',
};

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
          Наші <span className="text-brand-500">Послуги</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-12">
          Ми пропонуємо повний спектр послуг для вашого кавового бізнесу та дому. Оберіть те, що потрібно саме вам.
        </p>

        <div className="w-full h-[300px] md:h-[400px] relative rounded-3xl overflow-hidden mb-12 shadow-2xl border border-zinc-800">
          <Image 
            src="/images/services/hub_hero.png" 
            alt="Coffee Broadway Services" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {/* Repair */}
          <Link href="/services/repair" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-brand-500 hover:shadow-[0_0_30px_rgba(255,92,10,0.15)] transition-all group flex flex-col aspect-square">
            <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0">
              <Wrench className="text-brand-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">Ремонт</h2>
            <p className="text-zinc-400 mb-8 flex-grow">
              Професійний ремонт домашніх та промислових кавомашин. Швидка діагностика та якісні запчастини.
            </p>
            <span className="text-brand-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
              Залишити заявку <span>→</span>
            </span>
          </Link>

          {/* Maintenance */}
          <Link href="/services/maintenance" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-brand-500 hover:shadow-[0_0_30px_rgba(255,92,10,0.15)] transition-all group flex flex-col aspect-square">
            <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0">
              <Settings className="text-brand-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">Обслуговування</h2>
            <p className="text-zinc-400 mb-8 flex-grow">
              Комплексне сервісне обслуговування кав'ярень та кавових апаратів. Регулярна чистка та налаштування.
            </p>
            <span className="text-brand-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
              Залишити заявку <span>→</span>
            </span>
          </Link>

          {/* Rent */}
          <Link href="/services/rent" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-brand-500 hover:shadow-[0_0_30px_rgba(255,92,10,0.15)] transition-all group flex flex-col aspect-square">
            <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0">
              <Coffee className="text-brand-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">Оренда</h2>
            <p className="text-zinc-400 mb-8 flex-grow">
              Оренда професійних кавомашин та кавомолок для вашого закладу на вигідних умовах.
            </p>
            <span className="text-brand-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
              Детальніше <span>→</span>
            </span>
          </Link>

          {/* Barista Event */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-brand-500 hover:shadow-[0_0_30px_rgba(255,92,10,0.15)] transition-all group flex flex-col items-start aspect-square">
            <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0">
              <Users className="text-brand-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">Виїзний бариста</h2>
            <p className="text-zinc-400 mb-8 flex-grow">
              Професійний бариста на ваш захід. Забезпечимо кавою будь-яку подію, від корпоративу до весілля.
            </p>
            <div className="mt-auto w-full">
              <EventOrderButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
