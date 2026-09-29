import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ error: 'Telefon nömrəsi daxil edilməyib' }, { status: 400 });

    const { data, error } = await supabase.from('users').select('id').eq('phone', phone).single();
    
    if (data) {
      return NextResponse.json({ exists: true });
    }
    return NextResponse.json({ exists: false });
  } catch (error) {
    return NextResponse.json({ exists: false });
  }
}
