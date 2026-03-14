import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// 1. Initialize Supabase Admin (Required for updating profiles via webhooks)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Role Key for bypass RLS
);

export async function POST(req: Request) {
  try {
    // 2. Get the raw body for signature verification
    const rawBody = await req.text();
    
    // 3. Verify the LemonSqueezy Signature
    const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '');
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');

    if (signature.length !== digest.length || !crypto.timingSafeEqual(digest, signature)) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload['meta']['event_name'];
    
    // Extract custom data sent during checkout
    const userId = payload['meta']['custom_data']['user_id'];
    
    // Extract the variant name to determine the tier (e.g., "Standard" or "Professional")
    const variantName = payload['data']['attributes']['variant_name'] || 'standard';

    // 4. Handle successful payment events
    if (eventName === 'order_created' || eventName === 'subscription_created') {
      console.log(`Payment successful for user: ${userId} - Tier: ${variantName}`);

      // 5. Update the user's profile in Supabase
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ 
          subscription_tier: variantName.toLowerCase(),
          updated_at: new Date()
        })
        .eq('id', userId);

      if (error) {
        console.error("Supabase update error:", error);
        return new NextResponse('Database error', { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
