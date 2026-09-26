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
    const message = `MegaElan Giriş Kodu : ${otp}`;
    
    const payload = JSON.stringify({
      to: phone,
      text: message,
      senderName: '1sms.az' // Ekrandakı şəkildən göründüyü kimi default sender adı
    });

    const smsResponse = await fetch('https://1sms.az/api/v1/sms/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: payload
    });

    if (!smsResponse.ok) {
      const errorText = await smsResponse.text();
      console.error('1sms Error:', errorText);
      return NextResponse.json({ error: 'SMS göndərilə bilmədi' }, { status: 500 });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    return NextResponse.json({ 
      success: true, 
      message: 'SMS göndərildi',
      isNewUser: !existingUser
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Daxili server xətası' }, { status: 500 });
  }
}
