'use client'

import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('./Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[400px] bg-stone-100 animate-pulse flex items-center justify-center text-stone-400">Завантаження карти...</div>
})

export default function MapClient() {
  return <MapComponent />
}
