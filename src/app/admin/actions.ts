'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const image_file = formData.get('image_file') as File | null

  if (!name || !slug) throw new Error('Name and slug are required')

  let image_url = null

  if (image_file && image_file.size > 0) {
    const fileExt = image_file.name.split('.').pop()
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
    const filePath = `categories/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, image_file, {
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading image', uploadError)
    } else {
      const { data } = supabase.storage.from('images').getPublicUrl(filePath)
      image_url = data.publicUrl
    }
  }
  
  const parent_id_val = formData.get('parent_id') as string
  const parent_id = parent_id_val ? parent_id_val : null

  const { error } = await supabase.from('categories').insert({
    name,
    slug,
    description,
    image_url,
    parent_id
  })

  if (error) {
    console.error('Error creating category', error)
  }

  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function createItem(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const category_id = formData.get('category_id') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const is_available = formData.get('is_available') === 'on'
  const image_file = formData.get('image_file') as File | null

  if (!name || !slug || !category_id || isNaN(price)) {
    console.error('Missing fields')
    throw new Error('Please fill all required fields')
  }

  let image_url = null

  if (image_file && image_file.size > 0) {
    const fileExt = image_file.name.split('.').pop()
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
    const filePath = `items/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, image_file, {
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading image', uploadError)
    } else {
      const { data } = supabase.storage.from('images').getPublicUrl(filePath)
      image_url = data.publicUrl
    }
  }

  let characteristics = [];
  const charJson = formData.get('characteristics_json') as string;
  if (charJson) {
    try {
      characteristics = JSON.parse(charJson);
    } catch (e) {
      console.error('Error parsing characteristics_json', e);
    }
  }

  const { error } = await supabase.from('items').insert({
    name,
    slug,
    category_id,
    description,
    price,
    stock_quantity: 0,
    is_available,
    image_urls: image_url ? [image_url] : [],
    characteristics
  })

  if (error) {
    console.error('Error creating item', error)
  }

  revalidatePath('/admin/items')
  revalidatePath('/catalog')
  redirect('/admin/items')
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()
  
  const telegram_bot_token = formData.get('telegram_bot_token') as string
  const telegram_chat_id = formData.get('telegram_chat_id') as string
  const contact_phone = formData.get('contact_phone') as string
  const contact_address = formData.get('contact_address') as string
  const social_instagram = formData.get('social_instagram') as string
  const social_facebook = formData.get('social_facebook') as string

  // We assume there's only one row in site_settings.
  const { data: existing, error: fetchError } = await supabase.from('site_settings').select('id').limit(1).maybeSingle()

  if (fetchError) {
    console.error('Error fetching settings:', fetchError)
  }

  if (existing) {
    const { error } = await supabase.from('site_settings').update({
      telegram_bot_token,
      telegram_chat_id,
      contact_phone,
      contact_address,
      social_instagram,
      social_facebook,
      updated_at: new Date().toISOString()
    }).eq('id', existing.id)
    if (error) console.error('Error updating settings:', error)
  } else {
    const { error } = await supabase.from('site_settings').insert({
      telegram_bot_token,
      telegram_chat_id,
      contact_phone,
      contact_address,
      social_instagram,
      social_facebook,
    })
    if (error) console.error('Error inserting settings:', error)
  }

  revalidatePath('/admin/settings')
  revalidatePath('/contacts')
  revalidatePath('/', 'layout') // revalidate entire layout for footer
}

export async function updateServicesSettings(formData: FormData) {
  const supabase = await createClient()
  
  const rental_equipment_options = formData.get('rental_equipment_options') as string

  // We assume there's only one row in site_settings.
  const { data: existing, error: fetchError } = await supabase.from('site_settings').select('id').limit(1).maybeSingle()

  if (fetchError) {
    console.error('Error fetching settings:', fetchError)
  }

  if (existing) {
    const { error } = await supabase.from('site_settings').update({
      rental_equipment_options,
      updated_at: new Date().toISOString()
    }).eq('id', existing.id)
    if (error) console.error('Error updating services settings:', error)
  } else {
    const { error } = await supabase.from('site_settings').insert({
      rental_equipment_options,
    })
    if (error) console.error('Error inserting services settings:', error)
  }

  revalidatePath('/admin/services')
  revalidatePath('/services/rent')
  revalidatePath('/', 'layout')
}

export async function updateCategory(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const image_file = formData.get('image_file') as File | null
  const current_image_url = formData.get('current_image_url') as string

  if (!id || !name || !slug) throw new Error('ID, name and slug are required')

  let image_url = current_image_url

  if (image_file && image_file.size > 0) {
    const fileExt = image_file.name.split('.').pop()
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
    const filePath = `categories/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, image_file, { upsert: false })

    if (!uploadError) {
      const { data } = supabase.storage.from('images').getPublicUrl(filePath)
      image_url = data.publicUrl
    }
  }
  
  const parent_id_val = formData.get('parent_id') as string
  const parent_id = parent_id_val ? parent_id_val : null

  const { error } = await supabase.from('categories').update({
    name,
    slug,
    description,
    image_url,
    parent_id
  }).eq('id', id)

  if (error) console.error('Error updating category', error)

  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) console.error('Error deleting category', error)
  revalidatePath('/admin/categories')
}

export async function updateItem(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const category_id = formData.get('category_id') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const is_available = formData.get('is_available') === 'on'
  const image_file = formData.get('image_file') as File | null
  const current_image_url = formData.get('current_image_url') as string

  if (!id || !name || !slug || !category_id || isNaN(price)) {
    throw new Error('Please fill all required fields')
  }

  let image_urls = current_image_url ? [current_image_url] : []

  if (image_file && image_file.size > 0) {
    const fileExt = image_file.name.split('.').pop()
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
    const filePath = `items/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, image_file, { upsert: false })

    if (!uploadError) {
      const { data } = supabase.storage.from('images').getPublicUrl(filePath)
      image_urls = [data.publicUrl]
    }
  }

  let characteristics = [];
  const charJson = formData.get('characteristics_json') as string;
  if (charJson) {
    try {
      characteristics = JSON.parse(charJson);
    } catch (e) {
      console.error('Error parsing characteristics_json', e);
    }
  }

  const { error } = await supabase.from('items').update({
    name,
    slug,
    category_id,
    description,
    price,
    is_available,
    image_urls,
    characteristics
  }).eq('id', id)

  if (error) console.error('Error updating item', error)

  revalidatePath('/admin/items')
  revalidatePath('/catalog')
  redirect('/admin/items')
}

export async function deleteItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('items').delete().eq('id', id)
  if (error) console.error('Error deleting item', error)
  revalidatePath('/admin/items')
  revalidatePath('/catalog')
}

export async function submitReview(productId: string, userName: string, rating: number, reviewText: string) {
  const supabase = await createClient()
  
  if (!productId || !userName || rating < 1 || rating > 5 || !reviewText) {
    throw new Error('Invalid review data')
  }

  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    user_name: userName,
    rating,
    review_text: reviewText
  })

  if (error) {
    console.error('Error submitting review:', error)
    throw new Error('Failed to submit review')
  }

  revalidatePath(`/catalog`)
  revalidatePath(`/admin/reviews`)
}

export async function replyToReview(reviewId: string, replyText: string) {
  const supabase = await createClient()
  
  if (!reviewId || !replyText) {
    throw new Error('Invalid reply data')
  }

  const { error } = await supabase.from('reviews').update({
    reply_text: replyText,
    reply_created_at: new Date().toISOString()
  }).eq('id', reviewId)

  if (error) {
    console.error('Error replying to review:', error)
    throw new Error('Failed to reply to review')
  }

  revalidatePath(`/catalog`)
  revalidatePath(`/admin/reviews`)
}

export async function approveReview(reviewId: string) {
  const supabase = await createClient()
  
  if (!reviewId) throw new Error('Invalid review ID')

  const { error } = await supabase.from('reviews').update({
    status: 'approved'
  }).eq('id', reviewId)

  if (error) {
    console.error('Error approving review:', error)
    throw new Error('Failed to approve review')
  }

  revalidatePath(`/catalog`)
  revalidatePath(`/admin/reviews`)
}

export async function deleteReviewAdmin(reviewId: string) {
  const supabase = await createClient()
  
  if (!reviewId) throw new Error('Invalid review ID')

  const { error } = await supabase.from('reviews').delete().eq('id', reviewId)

  if (error) {
    console.error('Error deleting review:', error)
    throw new Error('Failed to delete review')
  }

  revalidatePath(`/catalog`)
  revalidatePath(`/admin/reviews`)
}

export async function submitQuestion(productId: string, userName: string, questionText: string) {
  const supabase = await createClient()
  
  if (!productId || !userName || !questionText) {
    throw new Error('Invalid question data')
  }

  const { error } = await supabase.from('product_questions').insert({
    product_id: productId,
    user_name: userName,
    question_text: questionText
  })

  if (error) {
    console.error('Error submitting question:', error)
    throw new Error('Failed to submit question')
  }

  revalidatePath(`/catalog`)
  revalidatePath(`/admin/questions`)
}

export async function replyToQuestion(questionId: string, replyText: string) {
  const supabase = await createClient()
  
  if (!questionId || !replyText) {
    throw new Error('Invalid reply data')
  }

  const { error } = await supabase.from('product_questions').update({
    reply_text: replyText,
    reply_created_at: new Date().toISOString()
  }).eq('id', questionId)

  if (error) {
    console.error('Error replying to question:', error)
    throw new Error('Failed to reply to question')
  }

  revalidatePath(`/catalog`)
  revalidatePath(`/admin/questions`)
}

export async function approveQuestion(questionId: string) {
  const supabase = await createClient()
  
  if (!questionId) throw new Error('Invalid question ID')

  const { error } = await supabase.from('product_questions').update({
    status: 'approved'
  }).eq('id', questionId)

  if (error) {
    console.error('Error approving question:', error)
    throw new Error('Failed to approve question')
  }

  revalidatePath(`/catalog`)
  revalidatePath(`/admin/questions`)
}

export async function deleteQuestionAdmin(questionId: string) {
  const supabase = await createClient()
  
  if (!questionId) throw new Error('Invalid question ID')

  const { error } = await supabase.from('product_questions').delete().eq('id', questionId)

  if (error) {
    console.error('Error deleting question:', error)
    throw new Error('Failed to delete question')
  }

  revalidatePath(`/catalog`)
  revalidatePath(`/admin/questions`)
}
