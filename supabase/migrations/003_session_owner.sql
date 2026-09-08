alter table sales_sessions
  add column if not exists seller_id uuid references auth.users(id) on delete restrict;

create index if not exists idx_sales_sessions_seller
  on sales_sessions(seller_id);
