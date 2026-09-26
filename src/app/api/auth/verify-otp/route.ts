import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { phone, otp, ad, soyad } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Məlumatlar tam deyil' }, { status: 400 });
    }

    // 1. Check OTP in database
    const { data: otpRecord, error: otpError } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', phone)
      .single();

    if (otpError || !otpRecord) {
      return NextResponse.json({ error: 'Kod tapılmadı və ya vaxtı bitib' }, { status: 400 });
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json({ error: 'Yanlış kod daxil etmisiniz' }, { status: 400 });
    }

    // Optional: Check if OTP is older than 5 minutes
    const createdTime = new Date(otpRecord.created_at).getTime();
    if (Date.now() - createdTime > 5 * 60 * 1000) {
      return NextResponse.json({ error: 'Kodun istifadə müddəti bitib' }, { status: 400 });
    }

    // 2. Clear used OTP
    await supabase.from('otps').delete().eq('phone', phone);

    // 3. Find or Create User
    let { data: existingUser, error: userFetchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (userFetchError && userFetchError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Sistem xətası baş verdi' }, { status: 500 });
    }

    if (!existingUser) {
      const fullName = (ad && soyad) ? `${ad.trim()} ${soyad.trim()}` : 'İstifadəçi';
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ phone, name: fullName }])
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: 'İstifadəçi yaradıla bilmədi' }, { status: 500 });
      }
      existingUser = newUser;
    }

    return NextResponse.json({ success: true, user: existingUser });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Daxili server xətası' }, { status: 500 });
  }
}
