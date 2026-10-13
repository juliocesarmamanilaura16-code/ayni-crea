-- Ayni Crea — esquema inicial Supabase
-- Ejecutar en el SQL editor del proyecto.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  city text check (city in ('El Alto', 'La Paz')),
  role text not null default 'client' check (role in ('client', 'artisan', 'admin')),
  points integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists designs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete set null,
  product_id text not null,
  name text not null,
  image_url text,
  customization jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete set null,
  artisan_id text not null,
  product_id text not null,
  product_name text not null,
  product_image text,
  customization jsonb not null default '{}',
  shipping numeric not null default 0,
  total numeric not null default 0,
  shipping_method text default '',
  payment_method text default 'qr' check (payment_method in ('qr', 'contra-entrega')),
  status text not null default 'realizado',
  notes text default '',
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  artisan_id text not null,
  order_id uuid references orders(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text default '',
  created_at timestamptz not null default now()
);

-- RLS básico: cada usuario lee/escribe solo lo suyo
alter table profiles enable row level security;
alter table designs enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own designs" on designs for all using (auth.uid() = client_id);
create policy "own orders" on orders for all using (auth.uid() = client_id);
create policy "own reviews" on reviews for all using (auth.uid() = user_id);

-- Storage: bucket `designs` para imágenes del lienzo (crear en Dashboard > Storage)
-- insert into storage.buckets (id, name, public) values ('designs', 'designs', true);
