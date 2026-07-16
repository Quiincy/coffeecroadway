import { CartProvider } from "@/components/providers/CartProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { createClient } from "@/utils/supabase/server";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });

  return (
    <CartProvider>
      <Header categories={categories || []} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </CartProvider>
  );
}
