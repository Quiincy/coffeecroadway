import { createClient } from '@/utils/supabase/server'
import CatalogClient from '@/components/ui/CatalogClient'
import { notFound } from 'next/navigation'

export const revalidate = 60 // revalidate every minute

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  // Fetch categories
  const { data: categories } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
  
  if (!categories) return notFound()

  const currentCategory = categories.find(c => c.slug === slug)
  if (!currentCategory) return notFound()

  // Find all category IDs to fetch items for (including subcategories)
  const categoryIdsToFetch = [currentCategory.id]
  const subcats = categories.filter(c => c.parent_id === currentCategory.id)
  subcats.forEach(sub => categoryIdsToFetch.push(sub.id))

  // Fetch items
  const { data: items, error } = await supabase
    .from('items')
    .select('*, category:categories(name)')
    .in('category_id', categoryIdsToFetch)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching items for category:', error)
  }

  const itemsList = items || []

  return (
    <CatalogClient items={itemsList} categories={categories} currentCategory={currentCategory} />
  )
}
