-- Add new columns to the profiles table for additional user information
ALTER TABLE public.profiles 
ADD COLUMN phone_number TEXT,
ADD COLUMN country TEXT,
ADD COLUMN sex TEXT,
ADD COLUMN date_of_birth DATE;

-- Create a storage bucket for deposit receipts
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'deposit-receipts',
  'deposit-receipts',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
);

-- Create RLS policies for the deposit receipts bucket
CREATE POLICY "Users can upload their own deposit receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'deposit-receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own deposit receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'deposit-receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add receipt_url column to transactions table for storing uploaded receipts
ALTER TABLE public.transactions 
ADD COLUMN receipt_url TEXT;