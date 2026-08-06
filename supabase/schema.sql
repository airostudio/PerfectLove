-- PerfectLove Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard -> SQL Editor -> New Query -> Run)
--
-- This script is idempotent: safe to run on a brand-new project, and safe to
-- re-run on top of an existing PerfectLove database to pick up anything new
-- (it only creates what's missing and only updates rows that need it).

-- ── 1. Orders table ─────────────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  reading_id text not null,
  answers jsonb not null default '{}',
  stripe_session_id text not null unique,
  amount_paid integer not null default 0,
  status text not null default 'processing' check (status in ('processing', 'delivered')),
  delivery_type text not null default 'standard' check (delivery_type in ('standard', 'express')),
  delivery_at timestamptz not null,
  image_url text,                     -- AI-generated sketch URL (soulmate-sketch / future-baby-sketch only)
  reading_html text,                  -- rendered email HTML, reused for the /reading/view page
  content_expires_at timestamptz,     -- 60-day access window; null/past = expired
  archive_stripe_session_id text,     -- set when the $1.99 archive retrieval extends access
  created_at timestamptz default now() not null
);

-- Backfill columns for databases created before any of these existed
alter table public.orders add column if not exists delivery_type text not null default 'standard' check (delivery_type in ('standard', 'express'));
alter table public.orders add column if not exists image_url text;
alter table public.orders add column if not exists reading_html text;
alter table public.orders add column if not exists content_expires_at timestamptz;
alter table public.orders add column if not exists archive_stripe_session_id text;

-- Bundle purchases use reading_id = 'complete-bundle', status = 'delivered' — no dedicated columns needed.
-- Ownership check: .eq('email', email).eq('reading_id', 'complete-bundle').eq('status', 'delivered')

create index if not exists idx_orders_delivery on public.orders (status, delivery_at)
  where status = 'processing';
create index if not exists idx_orders_email on public.orders (email);
create index if not exists idx_orders_reading on public.orders (email, reading_id);
create index if not exists idx_orders_content_expiry on public.orders (email, content_expires_at)
  where reading_html is not null;

alter table public.orders enable row level security;

drop policy if exists "Service role full access" on public.orders;
create policy "Service role full access" on public.orders
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ── 2. Tarot & Astrology monthly subscription ($1.99/mo) ───────────────────
-- Grants unlimited fresh Tarot / Astrology & Numerology readings while active.
-- Sold standalone — does not require the complete-collection bundle.
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  status text not null default 'active' check (status in ('active', 'past_due', 'canceled')),
  current_period_end timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_subscriptions_email on public.subscriptions (email);
create index if not exists idx_subscriptions_stripe_subscription on public.subscriptions (stripe_subscription_id);

alter table public.subscriptions enable row level security;

drop policy if exists "Service role full access" on public.subscriptions;
create policy "Service role full access" on public.subscriptions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ── 3. Normalize email casing ───────────────────────────────────────────────
-- The app always writes/looks up email in lowercase (lib/email.ts). Rows
-- inserted before that change may still have mixed-case emails, which a
-- case-sensitive lookup won't match against a normalized session email
-- (e.g. an order paid for as "Jane@Example.com" becomes invisible once the
-- app looks it up as "jane@example.com"). Safe to re-run — only touches rows
-- that still need it.
update public.orders set email = lower(trim(email)) where email <> lower(trim(email));
update public.subscriptions set email = lower(trim(email)) where email <> lower(trim(email));
