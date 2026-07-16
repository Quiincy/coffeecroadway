"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icons for leaflet in Next.js
const iconRetinaUrl = '/images/marker-icon-2x.png';
const iconUrl = '/images/marker-icon.png';
const shadowUrl = '/images/marker-shadow.png';

export default function DeliveryMap() {
  useEffect(() => {
    (async function init() {
      // @ts-expect-error - fixing leaflet default icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
      });
    })();
  }, []);

  const kyivCenter: [number, number] = [50.4501, 30.5234];

  // Example delivery zones
  const greenZone: [number, number][] = [
    [50.48, 30.45],
    [50.48, 30.55],
    [50.43, 30.55],
    [50.43, 30.45]
  ];
  
  const yellowZone: [number, number][] = [
    [50.50, 30.40],
    [50.50, 30.60],
    [50.40, 30.60],
    [50.40, 30.40]
  ];

  return (
    <div className="w-full h-full min-h-[400px] z-0 relative rounded-xl overflow-hidden border border-zinc-800">
      <MapContainer 
        center={kyivCenter} 
        zoom={11} 
        scrollWheelZoom={false}
        className="w-full h-full min-h-[400px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Outer yellow zone (e.g. 100 UAH delivery) */}
        <Polygon positions={yellowZone} pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.2 }}>
          <Tooltip sticky>Жовта зона: Доставка 100 грн</Tooltip>
        </Polygon>
        
        {/* Inner green zone (e.g. Free delivery) */}
        <Polygon positions={greenZone} pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.4 }}>
          <Tooltip sticky>Зелена зона: Безкоштовна доставка</Tooltip>
        </Polygon>

      </MapContainer>
    </div>
  );
}
