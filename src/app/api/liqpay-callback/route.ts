import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data = formData.get('data') as string;
    const signature = formData.get('signature') as string;

    // Validate signature with LIQPAY_PRIVATE_KEY
    // const privateKey = process.env.LIQPAY_PRIVATE_KEY;
    // const signString = privateKey + data + privateKey;
    // const expectedSignature = crypto.createHash('sha1').update(signString).digest('base64');
    
    // if (signature === expectedSignature) {
    //   const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    //   if (decodedData.status === 'success') {
    //      // Update order status in Supabase
    //   }
    // }

    // Always return 200 OK to LiqPay
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error("LiqPay webhook error:", error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
