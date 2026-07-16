"use client";

import dynamic from 'next/dynamic';

const DeliveryMapComponent = dynamic(() => import('./DeliveryMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[400px] bg-zinc-900 animate-pulse rounded-xl flex items-center justify-center border border-zinc-800 text-zinc-500">Завантаження карти...</div>
});

export default function DeliveryMapClient() {
  return <DeliveryMapComponent />;
}
