import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendTelegramNotification } from '@/utils/telegram';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { 
      type, // 'repair', 'rental', 'maintenance'
      customer_name, 
      customer_phone, 
      details 
    } = body;

    if (!type || !customer_name || !customer_phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Insert into database
    const { data: requestRecord, error } = await supabase
      .from('service_requests')
      .insert({
        type,
        customer_name,
        customer_phone,
        details: details || {},
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error("Service request creation error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Prepare telegram message
    let messageType = 'Заявка';
    if (type === 'repair') messageType = 'Заявка на ремонт';
    else if (type === 'rental') messageType = 'Заявка на оренду';
    else if (type === 'maintenance') messageType = 'Заявка на обслуговування';
    else if (type === 'event') messageType = 'Заявка на виїзного баристу';

    let message = `<b>Нова ${messageType}</b>\n\n`;
    message += `👤 <b>Ім'я:</b> ${customer_name}\n`;
    message += `📞 <b>Телефон:</b> ${customer_phone}\n\n`;
    message += `<b>Деталі:</b>\n`;

    for (const [key, value] of Object.entries(details || {})) {
      if (value) {
        message += `- ${key}: ${value}\n`;
      }
    }

    message += `\nID: #${requestRecord.id}`;

    // Send Telegram Notification
    await sendTelegramNotification(message);

    return NextResponse.json({ success: true, requestId: requestRecord.id });
  } catch (err: any) {
    console.error('Service request error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
