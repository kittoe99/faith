-- Create altar_practices table
create table if not exists altar_practices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null,
  purpose text,
  practices text[] default array[]::text[],
  sacrifices text[] default array[]::text[],
  custom_items text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for user_id
create index if not exists altar_practices_user_id_idx on altar_practices (user_id);

-- Create function to update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
   new.updated_at = now();
   return new;
end;
$$ language 'plpgsql';

-- Create trigger to update updated_at column
create trigger update_altar_practices_updated_at before update
on altar_practices for each row
execute procedure update_updated_at_column();
