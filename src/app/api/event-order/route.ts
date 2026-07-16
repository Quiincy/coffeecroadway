import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Assuming simple email/name capture for banquets
    console.log("New event order received:", body);
    
    // In a real application, you'd insert this into a 'event_orders' table
    // or send an email. For now, just return success.
    
    return NextResponse.json({ success: true, message: "Event order created" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
