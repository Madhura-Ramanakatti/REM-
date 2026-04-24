-- Enable Row Level Security
alter table if exists public.profiles enable row level security;
alter table if exists public.properties enable row level security;
alter table if exists public.reviews enable row level security;
alter table if exists public.enquiries enable row level security;
alter table if exists public.messages enable row level security;

-- Profiles table linked to Supabase Auth
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text default 'user' check (role in ('admin', 'user')),
  avatar_url text,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Properties table
create table if not exists public.properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price bigint not null,
  type text check (type in ('sale', 'rent')),
  category text,
  location text,
  city text,
  state text default 'Karnataka',
  bedrooms integer,
  bathrooms integer,
  area integer,
  year_built integer,
  images text[],
  features text[],
  agent_id uuid references public.profiles(id),
  is_featured boolean default false,
  status text default 'active' check (status in ('active', 'sold', 'rented')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reviews table
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, property_id)
);

-- Enquiries table
create table if not exists public.enquiries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  property_id uuid references public.properties(id) on delete cascade,
  name text,
  email text,
  phone text,
  message text,
  status text default 'pending' check (status in ('pending', 'responded')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages (Chat) table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete cascade,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES

-- Profiles: Anyone can view, only owner can update
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Properties: Anyone can view, only admins can manage
create policy "Properties are viewable by everyone." on properties for select using (true);
create policy "Admins can manage properties." on properties for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Reviews: Anyone can view, only owner can insert/update/delete
create policy "Reviews are viewable by everyone." on reviews for select using (true);
create policy "Authenticated users can post reviews." on reviews for insert with check (auth.uid() = user_id);
create policy "Users can update their own reviews." on reviews for update using (auth.uid() = user_id);
create policy "Users can delete their own reviews." on reviews for delete using (auth.uid() = user_id);

-- Enquiries: Users can see their own, admins can see all
create policy "Users can view their own enquiries." on enquiries for select using (
  auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Anyone can submit an enquiry." on enquiries for insert with check (true);

-- Messages: Only sender or receiver can view
create policy "Users can view their own messages." on messages for select using (
  auth.uid() = sender_id or auth.uid() = receiver_id
);
create policy "Users can send messages." on messages for insert with check (auth.uid() = sender_id);
