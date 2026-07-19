'use client'

import React, { useState, useTransition } from 'react'
import { HelpCircle, X } from 'lucide-react'
import { submitQuestion } from '@/app/admin/actions'
import { useFormStorage } from '@/hooks/useFormStorage'

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
}

export const QuestionModal = ({ isOpen, onClose, productName, productId }: QuestionModalProps) => {
  const [name, setName, clearName] = useFormStorage('coffee_question_name', '')
  const [question, setQuestion, clearQuestion] = useFormStorage('coffee_question_text', '')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      try {
        await submitQuestion(productId, name, question)
        setIsSubmitted(true)
        setTimeout(() => {
          onClose()
          setIsSubmitted(false)
          setName('')
          setQuestion('')
          clearName()
          clearQuestion()
        }, 2000)
      } catch (error) {
        console.error("Failed to submit question:", error)
        alert("Помилка при надсиланні питання. Спробуйте пізніше.")
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

        <h2 className="text-2xl font-bold text-white mb-2">Задати питання</h2>
        <p className="text-zinc-400 mb-6 text-sm line-clamp-1">{productName}</p>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-brand-500/20 text-brand-500 rounded-full flex items-center justify-center mb-4">
              <HelpCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Дякуємо!</h3>
            <p className="text-zinc-400">Ваше питання успішно відправлено.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Ваше ім'я" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors" 
            />
            
            <textarea 
              placeholder="Ваше питання" 
              rows={4} 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors resize-none"
            ></textarea>
            
            <button 
              type="submit" 
              disabled={!name.trim() || !question.trim() || isPending}
              className="bg-brand-500 text-white font-bold py-3 rounded-xl hover:bg-brand-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-[0_0_15px_rgba(255,92,10,0.3)]"
            >
              {isPending ? 'Відправка...' : 'Відправити питання'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
