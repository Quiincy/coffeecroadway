import { createClient } from '@/utils/supabase/server';

export async function sendTelegramNotification(message: string) {
  try {
    const supabase = await createClient();
    
    // Fetch settings
    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('telegram_bot_token, telegram_chat_id')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching site_settings for Telegram:', error);
      return false;
    }

    if (!settings?.telegram_bot_token || !settings?.telegram_chat_id) {
      console.warn('Telegram notifications not configured. Please set token and chat ID in site settings.');
      return false;
    }

    const { telegram_bot_token, telegram_chat_id } = settings;

    // Send to Telegram API
    const url = `https://api.telegram.org/bot${telegram_bot_token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegram_chat_id,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram API error:', errorText);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error sending Telegram notification:', err);
    return false;
  }
}
