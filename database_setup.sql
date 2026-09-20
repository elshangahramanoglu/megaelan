-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. YENİ İSTİFADƏÇİLƏR CƏDVƏLİ
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 2. YENİ ELANLAR CƏDVƏLİ
CREATE TABLE IF NOT EXISTS public.ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'AZN',
    city TEXT NOT NULL,
    category_id TEXT NOT NULL,
    sub_category TEXT,
    images TEXT[] DEFAULT '{}',
    details JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'active',
    is_premium BOOLEAN DEFAULT false,
    is_vip BOOLEAN DEFAULT false,
    premium_until TIMESTAMP WITH TIME ZONE,
    vip_until TIMESTAMP WITH TIME ZONE,
    views INTEGER DEFAULT 0,
    contact_name TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. BƏYƏNİLƏNLƏR (FAVORITES) CƏDVƏLİ
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    PRIMARY KEY (user_id, ad_id)
);

-- RLS (Row Level Security) Ayarları (Hər kəsin oxumasına və yazmasına icazə veririk - Test üçün)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hamı istifadəçiləri görə bilər" ON public.users FOR SELECT USING (true);
CREATE POLICY "Hamı istifadəçi yarada bilər" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "İstifadəçi öz məlumatlarını yeniləyə bilər" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Hamı elanları görə bilər" ON public.ads FOR SELECT USING (true);
CREATE POLICY "Hamı elan yarada bilər" ON public.ads FOR INSERT WITH CHECK (true);
CREATE POLICY "Hamı elanını yeniləyə bilər" ON public.ads FOR UPDATE USING (true);

CREATE POLICY "Hamı bəyənilənləri görə bilər" ON public.favorites FOR SELECT USING (true);
CREATE POLICY "Hamı bəyənilən əlavə edə bilər" ON public.favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Hamı bəyənilən silə bilər" ON public.favorites FOR DELETE USING (true);
