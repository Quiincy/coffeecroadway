import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Star, MessageSquare } from 'lucide-react'
import { replyToReview } from '../actions'

export const metadata = {
  title: 'Відгуки | Адмін панель',
}

export default async function AdminReviewsPage() {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) redirect('/admin/login')

  // Fetch reviews with product info
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      *,
      items ( name, slug )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 max-w-5xl">
      <h1 className="text-3xl font-black text-white mb-8">Управління відгуками</h1>

      {!reviews || reviews.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center text-zinc-500">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">Немає відгуків</h2>
          <p>Поки що жоден клієнт не залишив відгук.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{review.user_name}</h3>
                    <div className="flex items-center gap-1 text-brand-500 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} fill={star <= review.rating ? "currentColor" : "none"} className={star > review.rating ? "text-zinc-700" : ""} />
                      ))}
                      <span className="text-zinc-500 text-sm ml-2">{new Date(review.created_at).toLocaleDateString('uk-UA')}</span>
                    </div>
                  </div>
                  {review.items && (
                    <div className="text-sm px-3 py-1 bg-zinc-800 rounded-lg text-zinc-300">
                      Товар: <a href={`/catalog/${review.items.slug}`} target="_blank" className="text-brand-500 hover:underline">{review.items.name}</a>
                    </div>
                  )}
                </div>

                <p className="text-zinc-300 whitespace-pre-wrap">{review.review_text}</p>
              </div>

              {review.reply_text ? (
                <div className="bg-brand-500/5 border-t border-brand-500/20 p-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-500 text-sm">Ваша відповідь (Coffee Broadway)</span>
                    <span className="text-xs text-zinc-500">{new Date(review.reply_created_at).toLocaleDateString('uk-UA')}</span>
                  </div>
                  <p className="text-zinc-300 text-sm">{review.reply_text}</p>
                </div>
              ) : (
                <div className="bg-zinc-950 p-6 border-t border-zinc-800">
                  <form action={async (formData) => {
                    'use server'
                    const replyText = formData.get('reply_text') as string
                    await replyToReview(review.id, replyText)
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
