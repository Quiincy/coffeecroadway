"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        <span className="text-zinc-500">Немає фото</span>
      </div>
    );
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4 h-auto sm:h-[400px] lg:h-[500px]">
      {images.length > 1 && (
        <div className="flex flex-row sm:flex-col items-center gap-2 h-20 sm:h-auto sm:w-24 flex-shrink-0">
          <button onClick={prevImage} className="hidden sm:block text-zinc-500 hover:text-brand-500 transition-colors p-1">
            <ChevronUp size={24} />
          </button>
          
          <div className="flex-1 flex flex-row sm:flex-col gap-3 overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto w-full sm:h-full scrollbar-none py-1 sm:py-2 snap-x sm:snap-y">
            {images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-full sm:h-auto sm:w-full aspect-square flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all snap-start ${
                  idx === currentIndex ? "border-brand-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100 bg-zinc-900"
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>

          <button onClick={nextImage} className="hidden sm:block text-zinc-500 hover:text-brand-500 transition-colors p-1">
            <ChevronDown size={24} />
          </button>
        </div>
      )}

      <div className="relative w-full aspect-square sm:aspect-auto sm:h-full rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800 flex-1">
        <Image 
          src={images[currentIndex]} 
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-contain p-4 transition-opacity duration-300"
          priority
        />
      </div>
    </div>
  );
};
