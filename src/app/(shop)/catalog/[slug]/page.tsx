import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { ProductDetailsClient } from "@/components/ui/ProductDetailsClient";
import { RecentlyViewed } from "@/components/ui/RecentlyViewed";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('items')
    .select('name, description, image_url')
    .eq('slug', slug)
    .single();

  if (!product) {
    return {};
  }

  return {
    title: `${product.name} | Coffee Broadway`,
    description: product.description?.substring(0, 160) || `Придбати ${product.name} в Coffee Broadway. Крафтова кава та інвентар.`,
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 160) || `Придбати ${product.name} в Coffee Broadway. Крафтова кава та інвентар.`,
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const { slug } = await params;
  
  // Fetch product from 'items' table by slug
  const { data: product, error } = await supabase
    .from('items')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching product:", error);
  }
  
  if (!product) return notFound();

  // Fetch all categories to build the hierarchy
  const { data: categories } = await supabase.from('categories').select('id, name, parent_id');

  // Build breadcrumbs hierarchy
  const hierarchy = [];
  if (categories && product.category_id) {
    let currentCat = categories.find(c => c.id === product.category_id);
    while (currentCat) {
      hierarchy.unshift({ id: currentCat.id, name: currentCat.name, parent_id: currentCat.parent_id });
      const parentId = currentCat.parent_id;
      currentCat = categories.find(c => c.id === parentId);
    }
  }

  // Fetch reviews for this product
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', product.id)
    .order('created_at', { ascending: false });

  return (
    <AnimatedPage className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-zinc-900/40 p-6 md:p-10 rounded-3xl border border-zinc-800/80 shadow-2xl">
        <ProductDetailsClient product={product} categoryHierarchy={hierarchy} initialReviews={reviews || []} />
      </div>

      <RecentlyViewed currentProductId={product.id} />
    </AnimatedPage>
  );
}
