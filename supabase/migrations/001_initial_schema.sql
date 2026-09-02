create extension if not exists pgcrypto;

create table if not exists sales_sessions (
  id uuid primary key default gen_random_uuid(),
  seller_name text,
  buyer_name text,
  company_name text,
  sector text,
  spin_stage text not null default 'SITUATION',
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists conversation_turns (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sales_sessions(id) on delete cascade,
  speaker text not null check (speaker in ('SELLER', 'BUYER')),
  transcript text not null,
  created_at timestamptz not null default now()
);

create table if not exists problems (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sales_sessions(id) on delete cascade,
  description text not null,
  confidence numeric(5,4) default 0.5,
  created_at timestamptz not null default now()
);

create table if not exists ctqs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sales_sessions(id) on delete cascade,
  name text not null,
  current_value text,
  target_value text,
  unit text,
  confidence numeric(5,4) default 0.5,
  created_at timestamptz not null default now()
);

create table if not exists impacts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sales_sessions(id) on delete cascade,
  description text not null,
  estimated_value numeric,
  currency text,
  confidence numeric(5,4) default 0.5,
  created_at timestamptz not null default now()
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sales_sessions(id) on delete cascade,
  action_type text not null,
  action_text text not null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists idx_turns_session
  on conversation_turns(session_id);

create index if not exists idx_problems_session
  on problems(session_id);

create index if not exists idx_ctqs_session
  on ctqs(session_id);
