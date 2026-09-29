-- 1. Elanda real baxış sayı üçün views sütunu əlavə edilir
ALTER TABLE ads ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;

-- Baxış sayını artırmaq üçün RPC (Remote Procedure Call)
CREATE OR REPLACE FUNCTION increment_ad_views(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE ads SET views = COALESCE(views, 0) + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Mesajlaşma sistemi üçün messages cədvəli
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ad_id UUID REFERENCES ads(id) ON DELETE SET NULL, -- Hansı elanla bağlı olduğunu bilmək üçün (opsional)
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Realtime aktiv etmək (Supabase-də mesajlaşmanın canlı işləməsi üçün vacibdir)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
