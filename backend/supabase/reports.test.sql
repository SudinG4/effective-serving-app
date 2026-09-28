-- Integration test for an EMPTY, DISPOSABLE local PostgreSQL database only.
-- psql -v ON_ERROR_STOP=1 -f backend/supabase/reports.test.sql
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb, raw_app_meta_data jsonb);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema auth to authenticated;
grant execute on function auth.uid() to authenticated;
create table public.assessments(id uuid primary key default gen_random_uuid(), user_id uuid references auth.users,
  answers jsonb, total_score integer, risk_level text, domain_scores jsonb, completed_at timestamptz default now());
grant select, insert, update, delete on public.assessments to authenticated;
insert into auth.users values
('00000000-0000-4000-8000-000000000001', 'one@example.com', '{"first_name":"One", "role":"admin"}', '{}'),
('00000000-0000-4000-8000-000000000002', 'two@example.com', '{"first_name":"Two"}', '{}'),
('00000000-0000-4000-8000-000000000003', 'admin@example.com', '{}', '{"role":"admin"}');
\ir 001_reports.sql
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', false);
insert into public.assessments(user_id, answers, total_score) select auth.uid(), jsonb_object_agg(n::text, 2), 0 from generate_series(1,27) n;
do $$ begin
 if (select count(*) from public.reports) <> 1 then raise exception 'Owner report missing'; end if;
 if (select total_score from public.reports limit 1) <> 54 then raise exception 'Forged score accepted'; end if;
 if public.is_report_admin() then raise exception 'User metadata grants admin'; end if;
 begin
   insert into public.reports select * from public.reports;
   raise exception 'Direct report insertion allowed';
 exception when insufficient_privilege then null; end;
 begin
   insert into public.assessments(user_id, answers) select '00000000-0000-4000-8000-000000000002', jsonb_object_agg(n::text, 2) from generate_series(1,27) n;
   raise exception 'Cross-user assessment insertion allowed';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', false);
do $$ begin
 if (select count(*) from public.reports) <> 0 then raise exception 'Other user report leaked'; end if;
end $$;
insert into public.assessments(user_id, answers) select auth.uid(), jsonb_object_agg(n::text, 4) from generate_series(1,27) n;
do $$ begin
 if (select count(*) from public.reports) <> 1 then raise exception 'User report isolation failed'; end if;
end $$;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000003', false);
do $$ begin
 if (select count(*) from public.reports) <> 2 then raise exception 'Admin cannot read all reports'; end if;
end $$;
reset role;
update auth.users set raw_app_meta_data = '{}' where id = '00000000-0000-4000-8000-000000000003';
set role authenticated;
do $$ begin
 if (select count(*) from public.reports) <> 0 then raise exception 'Revoked admin still has access'; end if;
end $$;
reset role;
set role anon;
do $$ begin
 begin
   perform * from public.reports;
   raise exception 'Anonymous report access allowed';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
-- A failed report insert must roll back the assessment insert too.
alter table public.reports add constraint test_force_report_failure check (total_score < 108) not valid;
do $$ declare before_count integer; begin
 select count(*) into before_count from public.assessments;
 begin
   insert into public.assessments(user_id, answers) select '00000000-0000-4000-8000-000000000001', jsonb_object_agg(n::text, 4) from generate_series(1,27) n;
   raise exception 'Expected report failure missing';
 exception when check_violation then null; end;
 if (select count(*) from public.assessments) <> before_count then raise exception 'Orphan assessment saved'; end if;
end $$;
alter table public.reports drop constraint test_force_report_failure;
\echo Report storage and access integration tests passed.
