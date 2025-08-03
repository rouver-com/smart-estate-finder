-- Fix security issues: Set proper search path for functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update Properties with real data from Supabase
UPDATE public.properties 
SET 
  images = ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'],
  agent_image = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
WHERE id IN (SELECT id FROM public.properties LIMIT 1);

UPDATE public.properties 
SET images = ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80']
WHERE location = 'الإسكندرية - سموحة';

UPDATE public.properties 
SET images = ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80']
WHERE location = 'القاهرة - التجمع الخامس';