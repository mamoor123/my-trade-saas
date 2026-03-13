import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // 1. Get the raw body as text for signature verification
    const rawBody = await req.text();
    
    // 2. Get the signature sent by LemonSqueezy
    const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '');
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');

    // 3. Verify that the request actually came from LemonSqueezy
    if (signature.length !== digest.length || !crypto.timingSafeEqual(digest, signature)) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload['meta']['event_name'];
    const userId = payload['meta']['custom_data']['user_id'];

    // 4. Handle the payment events
    if (eventName === 'order_created' || eventName === 'subscription_created') {
      console.log(`Payment successful for user: ${userId}`);
      // In the next step, we will add the code here to update your Supabase database
    }

    return NextResponse.json({ message: 'Webhook received' });
  } catch (err) {
    return new NextResponse('Webhook error', { status: 500 });
  }
}