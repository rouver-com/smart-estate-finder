-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  price_type TEXT DEFAULT 'للبيع' CHECK (price_type IN ('للبيع', 'للإيجار')),
  property_type TEXT NOT NULL CHECK (property_type IN ('شقة', 'فيلا', 'مكتب', 'محل تجاري', 'أرض', 'مستودع')),
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  parking INTEGER DEFAULT 0,
  area DECIMAL(10,2),
  build_year INTEGER,
  floor_number TEXT,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  agent_name TEXT,
  agent_phone TEXT,
  agent_email TEXT,
  agent_image TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inquiries table for customer messages
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'عام' CHECK (inquiry_type IN ('عام', 'معاينة', 'استفسار سعر', 'تفاوض')),
  status TEXT DEFAULT 'جديد' CHECK (status IN ('جديد', 'قيد المراجعة', 'تم الرد', 'مكتمل')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_conversations table for AI conversations
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  conversation_data JSONB DEFAULT '[]',
  status TEXT DEFAULT 'نشط' CHECK (status IN ('نشط', 'مكتمل', 'مغلق')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Properties policies (public read, admin write)
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties FOR SELECT 
USING (is_active = true);

-- Inquiries policies (anyone can insert, admin can read)
CREATE POLICY "Anyone can create inquiries" 
ON public.inquiries FOR INSERT 
WITH CHECK (true);

-- Chat conversations policies (anyone can insert/update own session)
CREATE POLICY "Anyone can manage their chat session" 
ON public.chat_conversations FOR ALL 
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.properties (
  title, description, location, price, price_type, property_type,
  bedrooms, bathrooms, parking, area, build_year, floor_number,
  images, features, amenities, agent_name, agent_phone, agent_email,
  is_featured
) VALUES 
(
  'فيلا فاخرة مع مسبح خاص',
  'فيلا راقية في موقع متميز بمدينة نصر مع تشطيبات عالية الجودة ومسبح خاص وحديقة واسعة',
  'القاهرة - مدينة نصر',
  15000000,
  'للبيع',
  'فيلا',
  5, 4, 3, 450, 2020, 'فيلا منفصلة',
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'],
  ARRAY['مسبح', 'حديقة', 'مفروش'],
  ARRAY['مسبح خاص', 'موقف 3 سيارات', 'حديقة', 'شرفة', 'غرفة خادمة'],
  'أحمد محمد العلي', '+20 100 123 4567', 'ahmed@realestate.com',
  true
),
(
  'شقة حديثة بإطلالة رائعة',
  'شقة عصرية في برج راقي مع جميع الخدمات وإطلالة مميزة',
  'الإسكندرية - سموحة',
  25000,
  'للإيجار',
  'شقة',
  3, 2, 2, 180, 2019, 'الطابق العاشر',
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
  ARRAY['شرفة', 'مصعد', 'أمن 24/7'],
  ARRAY['شرفة', 'مصعد', 'أمن 24/7', 'موقف سيارات'],
  'فاطمة أحمد', '+20 101 234 5678', 'fatma@realestate.com',
  true
),
(
  'شقة فاخرة في التجمع الخامس',
  'شقة عصرية في كمبوند راقي بالتجمع الخامس مع تشطيبات فاخرة',
  'القاهرة - التجمع الخامس',
  3200000,
  'للبيع',
  'شقة',
  4, 3, 2, 220, 2021, 'الطابق الخامس',
  ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
  ARRAY['شرفة', 'مفروش', 'أمن 24/7'],
  ARRAY['شرفة', 'مفروش', 'أمن 24/7', 'مصعد'],
  'محمد علي', '+20 102 345 6789', 'mohamed@realestate.com',
  false
);