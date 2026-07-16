import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center bg-zinc-950 text-white overflow-hidden">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950 z-10" />
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 z-0 w-full h-full object-cover opacity-60 mix-blend-screen"
        >
          <source src="/hero-video.webm" type="video/webm" />
          Ваш браузер не підтримує відео.
        </video>
        
        <div className="relative z-20 text-center px-4 max-w-5xl animate-fade-in-up">
          <div className="inline-block border border-brand-500/30 bg-brand-500/10 backdrop-blur-sm text-brand-500 font-bold px-4 py-1.5 rounded-full text-sm mb-6 uppercase tracking-widest">
            Premium Coffee & Equipment
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
            ТЕМНА ЕНЕРГІЯ <br/> <span className="text-brand-500">ТВОГО РАНКУ</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto font-medium">
            Безкомпромісна якість кави та професійний інвентар для справжніх естетів.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/catalog" className="bg-brand-500 hover:bg-brand-400 text-white px-10 py-5 rounded-2xl font-bold transition-all text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,92,10,0.3)] hover:shadow-[0_0_40px_rgba(255,92,10,0.5)] hover:-translate-y-1">
              Перейти до каталогу <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-4xl font-black text-white mb-16 text-center tracking-tight">ЩО МИ <span className="text-brand-500">ПРОПОНУЄМО</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "КАВА В ЗЕРНАХ", image: "/coffee-beans.png" },
            { title: "ПІТЧЕРИ", image: "/pitcher.png" },
            { title: "ТЕМПЕРИ", image: "/tamper.png" }
          ].map((cat, i) => (
            <div key={i} className="bg-zinc-800/30 backdrop-blur-md p-6 rounded-[2.5rem] border border-zinc-700/50 hover:border-brand-500/50 hover:bg-zinc-800/60 transition-all group cursor-pointer flex flex-col">
              <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-[1.5rem] overflow-hidden mb-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <Image src={cat.image} alt={cat.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="text-center pb-2 flex-grow flex items-center justify-center">
                <h3 className="text-xl font-bold text-white tracking-widest">{cat.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
