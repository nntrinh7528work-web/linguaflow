-- LinguaFlow Database Schema
-- Migration: 001_initial_schema.sql

-- Users profile (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users primary key,
  full_name text,
  telegram_chat_id text,
  telegram_bot_token text,
  pomodoro_work_minutes int default 25,
  pomodoro_break_minutes int default 5,
  daily_reminder_time time default '08:00',
  created_at timestamptz default now()
);

-- Study sessions (each Pomodoro block)
create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  language text check (language in ('japanese', 'english')),
  topic text,
  started_at timestamptz,
  ended_at timestamptz,
  pomodoro_count int default 0,
  status text check (status in ('completed', 'partial', 'missed')) default 'completed',
  created_at timestamptz default now()
);

-- Vocabulary notes
create table public.vocabulary_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  session_id uuid references study_sessions(id),
  language text check (language in ('japanese', 'english')),
  word text not null,
  reading text,
  meaning text,
  example_sentence text,
  ai_memory_hook text,
  tags text[],
  created_at timestamptz default now()
);

-- Grammar notes
create table public.grammar_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  session_id uuid references study_sessions(id),
  language text check (language in ('japanese', 'english')),
  pattern text not null,
  explanation text,
  examples text[],
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz default now()
);

-- Free notes
create table public.free_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  session_id uuid references study_sessions(id),
  title text,
  content text,
  youtube_url text,
  language text,
  created_at timestamptz default now()
);

-- Study schedules
create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date not null,
  start_time time,
  end_time time,
  language text check (language in ('japanese', 'english')),
  topic text,
  goal text,
  status text check (status in ('pending', 'completed', 'partial', 'missed')) default 'pending',
  created_at timestamptz default now()
);

-- Quiz sessions
create table public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  score int,
  total int,
  questions_json jsonb,
  language text,
  created_at timestamptz default now()
);

-- Video analyses
create table public.video_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  youtube_url text,
  language text,
  title text,
  result_json jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security on ALL tables
alter table profiles enable row level security;
alter table study_sessions enable row level security;
alter table vocabulary_notes enable row level security;
alter table grammar_notes enable row level security;
alter table free_notes enable row level security;
alter table schedules enable row level security;
alter table quiz_sessions enable row level security;
alter table video_analyses enable row level security;

-- RLS policies (users can only access their own data)
create policy "Users own their data" on profiles for all using (auth.uid() = id);
create policy "Users own their data" on study_sessions for all using (auth.uid() = user_id);
create policy "Users own their data" on vocabulary_notes for all using (auth.uid() = user_id);
create policy "Users own their data" on grammar_notes for all using (auth.uid() = user_id);
create policy "Users own their data" on free_notes for all using (auth.uid() = user_id);
create policy "Users own their data" on schedules for all using (auth.uid() = user_id);
create policy "Users own their data" on quiz_sessions for all using (auth.uid() = user_id);
create policy "Users own their data" on video_analyses for all using (auth.uid() = user_id);

-- Function to auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
