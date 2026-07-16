import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // The body matches the structure sent from CheckoutForm
    const { 
      customer_name, 
      customer_phone, 
      delivery_address, 
      comment, 
      items, 
      total_price, 
      payment_method 
    } = body;

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_name,
        customer_phone,
        delivery_address,
        comment,
        items,
        total_price,
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error("Order creation error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Logic for LiqPay could go here if payment_method === 'card'
    // For now, return a placeholder URL or just success for cash.
    let liqpayUrl = null;
    if (payment_method === 'card') {
      // In a real app, generate LiqPay form data and return the redirect URL
      liqpayUrl = `https://www.liqpay.ua/api/3/checkout?data=example&signature=example`;
    }

    return NextResponse.json({ success: true, orderId: order.id, liqpayUrl });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
