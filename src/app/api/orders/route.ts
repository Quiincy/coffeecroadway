import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendTelegramNotification } from '@/utils/telegram';

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

    // Format items for telegram message
    let itemsList = '';
    let totalItemsCount = 0;
    
    // items is usually an array of cart items
    if (Array.isArray(items)) {
      items.forEach((item: any, index: number) => {
        itemsList += `${index + 1}. ${item.name} - ${item.quantity} шт. x ${item.price} ₴\n`;
        totalItemsCount += item.quantity || 1;
      });
    } else {
      itemsList = 'Товари вказані у форматі JSON';
    }

    // Prepare telegram message
    let message = `<b>Нове замовлення товару</b>\n\n`;
    message += `👤 <b>Ім'я:</b> ${customer_name}\n`;
    message += `📞 <b>Телефон:</b> ${customer_phone}\n`;
    message += `📍 <b>Адреса:</b> ${delivery_address || 'Не вказана'}\n`;
    message += `💳 <b>Оплата:</b> ${payment_method === 'card' ? 'Карткою онлайн' : 'Готівкою/при отриманні'}\n\n`;
    
    if (comment) {
      message += `💬 <b>Коментар:</b>\n${comment}\n\n`;
    }

    message += `<b>Кошик:</b>\n${itemsList}\n`;
    message += `💰 <b>Сума:</b> ${total_price} ₴\n`;
    message += `\nID: #${order.id}`;

    // Send Telegram Notification
    await sendTelegramNotification(message);

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
