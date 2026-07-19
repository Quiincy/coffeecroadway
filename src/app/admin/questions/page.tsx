import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MessageSquare, CheckCircle, Trash2, Clock, AlertCircle } from 'lucide-react'
import { replyToQuestion, approveQuestion, deleteQuestionAdmin } from '../actions'

export const metadata = {
  title: 'Питання | Адмін панель',
}

export default async function AdminQuestionsPage() {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) redirect('/admin/login')

  // Fetch questions with product info
  const { data: questions, error } = await supabase
    .from('product_questions')
    .select(`
      *,
      items ( name, slug )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching questions:', error)
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 max-w-5xl">
      <h1 className="text-3xl font-black text-white mb-8">Управління питаннями</h1>

      {!questions || questions.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center text-zinc-500">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">Немає питань</h2>
          <p>Поки що жоден клієнт не задав питання.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{question.user_name}</h3>
                    <div className="flex items-center gap-1 text-zinc-500 mt-1">
                      <span className="text-sm">{new Date(question.created_at).toLocaleDateString('uk-UA')}</span>
                    </div>
                  </div>
                  {question.items && (
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm px-3 py-1 bg-zinc-800 rounded-lg text-zinc-300">
                        Товар: <a href={`/catalog/${question.items.slug}`} target="_blank" className="text-brand-500 hover:underline">{question.items.name}</a>
                      </div>
                      
                      {/* Status Badge */}
                      {question.status === 'pending' && (
                        <div className="flex items-center gap-1 text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-md">
                          <Clock size={12} /> Очікує модерації
                        </div>
                      )}
                      {question.status === 'approved' && (
                        <div className="flex items-center gap-1 text-xs px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md">
                          <CheckCircle size={12} /> Опубліковано
                        </div>
                      )}
                      {question.status === 'rejected' && (
                        <div className="flex items-center gap-1 text-xs px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md">
                          <AlertCircle size={12} /> Відхилено
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-zinc-300 whitespace-pre-wrap">{question.question_text}</p>
                
                {/* Moderation Actions */}
                {question.status === 'pending' && (
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-zinc-800">
                    <form action={async () => {
                      'use server'
                      await approveQuestion(question.id)
                    }}>
                      <button type="submit" className="flex items-center gap-2 bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                        <CheckCircle size={16} /> Опублікувати
                      </button>
                    </form>
                    
                    <form action={async () => {
                      'use server'
                      await deleteQuestionAdmin(question.id)
                    }}>
                      <button type="submit" className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                        <Trash2 size={16} /> Видалити
                      </button>
                    </form>
                  </div>
                )}
                
                {question.status === 'approved' && (
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-zinc-800">
                    <form action={async () => {
                      'use server'
                      await deleteQuestionAdmin(question.id)
                    }}>
                      <button type="submit" className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                        <Trash2 size={16} /> Видалити питання
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {question.reply_text && (
                <div className="bg-brand-500/5 border-t border-brand-500/20 p-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-500 text-sm">Ваша відповідь (Coffee Broadway)</span>
                    <span className="text-xs text-zinc-500">{new Date(question.reply_created_at).toLocaleDateString('uk-UA')}</span>
                  </div>
                  <p className="text-zinc-300 text-sm">{question.reply_text}</p>
                </div>
              )}
              {question.status === 'approved' && !question.reply_text && (
                <div className="bg-zinc-950 p-6 border-t border-zinc-800">
                  <form action={async (formData) => {
                    'use server'
                    const replyText = formData.get('reply_text') as string
                    await replyToQuestion(question.id, replyText)
                  }} className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-zinc-400">Відповісти від імені Coffee Broadway</label>
                    <textarea 
                      name="reply_text"
                      rows={3}
                      placeholder="Напишіть вашу відповідь клієнту..."
                      required
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 resize-none w-full"
                    ></textarea>
                    <div className="flex justify-end">
                      <button type="submit" className="bg-brand-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-400 transition-colors">
                        Надіслати відповідь
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
