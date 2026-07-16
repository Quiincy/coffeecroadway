import { createClient } from '@/utils/supabase/server'
import CatalogClient from '@/components/ui/CatalogClient'

export const revalidate = 60 // revalidate every minute

export default async function CatalogPage() {
  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
  
  // Fetch items
  const { data: items, error } = await supabase
    .from('items')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching items:', error)
  }

  const itemsList = items || []

  return (
    <CatalogClient items={itemsList} categories={categories || []} />
  )
}
