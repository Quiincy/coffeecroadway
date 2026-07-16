'use client'

import React, { useState, useTransition } from 'react'
import { Star, X } from 'lucide-react'
import { submitReview } from '@/app/admin/actions'

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
}

export const ReviewModal = ({ isOpen, onClose, productName, productId }: ReviewModalProps) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [name, setName] = useState('')
  const [review, setReview] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      try {
        await submitReview(productId, name, rating, review)
        setIsSubmitted(true)
        setTimeout(() => {
          onClose()
          setIsSubmitted(false)
          setRating(0)
          setName('')
          setReview('')
        }, 2000)
      } catch (error) {
        console.error("Failed to submit review:", error)
        alert("Помилка при надсиланні відгуку. Спробуйте пізніше.")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Написати відгук</h2>
        <p className="text-zinc-400 mb-6 text-sm line-clamp-1">{productName}</p>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-brand-500/20 text-brand-500 rounded-full flex items-center justify-center mb-4">
              <Star size={32} fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Дякуємо за відгук!</h3>
            <p className="text-zinc-400">Ваш відгук успішно надіслано.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col items-center mb-2">
              <span className="text-sm font-medium text-zinc-400 mb-2">Ваша оцінка</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      size={32} 
                      className={`${(hoveredRating || rating) >= star ? 'text-brand-500 fill-brand-500' : 'text-zinc-700'} transition-colors`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <input 
              type="text" 
              placeholder="Ваше ім'я" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors" 
            />
            
            <textarea 
              placeholder="Ваш відгук" 
              rows={4} 
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors resize-none"
            ></textarea>
            
            <button 
              type="submit" 
              disabled={rating === 0 || !name.trim() || !review.trim() || isPending}
              className="bg-brand-500 text-white font-bold py-3 rounded-xl hover:bg-brand-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-[0_0_15px_rgba(255,92,10,0.3)]"
            >
              {isPending ? 'Надсилання...' : 'Надіслати відгук'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
