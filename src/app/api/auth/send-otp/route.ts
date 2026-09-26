import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Telefon nömrəsi daxil edilməyib' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Store OTP in Supabase otps table
    const { error: dbError } = await supabase
      .from('otps')
      .upsert({ phone, otp, created_at: new Date().toISOString() }, { onConflict: 'phone' });

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return NextResponse.json({ error: 'Sistem xətası baş verdi' }, { status: 500 });
    }

    // 2. Send via 1sms API
    const apiKey = process.env.ONESMS_API_KEY;
    const hmacSecret = process.env.ONESMS_HMAC_SECRET;

    if (!apiKey || !hmacSecret) {
      return NextResponse.json({ error: 'SMS API açarları tapılmadı' }, { status: 500 });
    }

    // Based on common HMAC SMS API implementations (like 1sms),
    // you might need to hash the payload or a specific string. 
    // We are implementing a standard JSON request structure.
    const message = `Sizin təsdiq kodunuz: ${otp}`;
    
    const payload = JSON.stringify({
      phone: phone,
      text: message,
      sender: 'MegaElan' // Assuming default sender or alphanumeric ID
    });

    // Generate HMAC signature
    const signature = crypto.createHmac('sha256', hmacSecret)
                            .update(payload)
                            .digest('hex');

    const smsResponse = await fetch('https://api.1sms.az/api/v1/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-Signature': signature
      },
      body: payload
    });

    if (!smsResponse.ok) {
      const errorText = await smsResponse.text();
      console.error('1sms Error:', errorText);
      return NextResponse.json({ error: 'SMS göndərilə bilmədi' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'SMS göndərildi' });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Daxili server xətası' }, { status: 500 });
  }
}
