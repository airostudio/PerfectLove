-- PerfectLove Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard -> SQL Editor)

-- 1. Create the orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  reading_id text not null,
  answers jsonb not null default '{}',
  stripe_session_id text not null unique,
  amount_paid integer not null default 0,
  status text not null default 'processing' check (status in ('processing', 'delivered')),
  delivery_type text not null default 'standard' check (delivery_type in ('standard', 'express')),
  delivery_at timestamptz not null,
  image_url text,                     -- AI-generated sketch URL (soulmate-sketch only)
  created_at timestamptz default now() not null
);

-- Migration for existing databases: run these if table already exists
-- alter table public.orders add column if not exists delivery_type text not null default 'standard' check (delivery_type in ('standard', 'express'));
-- alter table public.orders add column if not exists image_url text;

-- 2. Index for the cron job query (finds orders ready to deliver)
create index idx_orders_delivery on public.orders (status, delivery_at)
  where status = 'processing';

-- 3. Index for looking up orders by email
create index idx_orders_email on public.orders (email);

-- 4. Index for looking up orders by reading type
create index idx_orders_reading on public.orders (email, reading_id);

-- Migration for reading content storage and archive retrieval:
-- alter table public.orders add column if not exists reading_html text;
-- alter table public.orders add column if not exists content_expires_at timestamptz;
-- alter table public.orders add column if not exists archive_stripe_session_id text;
-- create index if not exists idx_orders_content_expiry on public.orders (email, content_expires_at) where reading_html is not null;

-- 5. Enable Row Level Security (required by Supabase best practices)
alter table public.orders enable row level security;

-- 6. Policy: only the service role (backend) can access orders
create policy "Service role full access" on public.orders
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
