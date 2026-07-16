import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch categories and items
    const { data: categories, error: catError } = await supabase.from('categories').select('*').order('sort_order');
    const { data: items, error: itemError } = await supabase.from('items').select('*').order('sort_order');

    if (catError || itemError) {
      throw new Error("Failed to fetch menu");
    }

    return NextResponse.json({ success: true, categories, items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
