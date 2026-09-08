alter table sales_sessions
  add column if not exists recording_consent boolean not null default false,
  add column if not exists consent_timestamp timestamptz,
  add column if not exists retention_expires_at timestamptz,
  add column if not exists sales_context jsonb;

alter table sales_sessions
  add constraint sales_sessions_consent_timestamp_check
  check (not recording_consent or consent_timestamp is not null);

create index if not exists idx_sales_sessions_retention
  on sales_sessions(retention_expires_at)
  where retention_expires_at is not null;
