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
  delivery_at timestamptz not null,
  created_at timestamptz default now() not null
);

-- 2. Index for the cron job query (finds orders ready to deliver)
create index idx_orders_delivery on public.orders (status, delivery_at)
  where status = 'processing';

-- 3. Index for looking up orders by email
create index idx_orders_email on public.orders (email);

-- 4. Index for looking up orders by reading type
create index idx_orders_reading on public.orders (email, reading_id);

-- 5. Enable Row Level Security (required by Supabase best practices)
alter table public.orders enable row level security;

-- 6. Policy: only the service role (backend) can access orders
create policy "Service role full access" on public.orders
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
