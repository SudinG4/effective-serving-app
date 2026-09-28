-- Run in the Supabase SQL editor as the database owner.
begin;

create or replace function public.is_report_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select raw_app_meta_data->>'role' = 'admin'
    from auth.users where id = auth.uid()), false);
$$;
revoke all on function public.is_report_admin() from public;
grant execute on function public.is_report_admin() to authenticated;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null unique references public.assessments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  generated_at timestamptz not null default now(),
  version integer not null default 1,
  user_details jsonb not null,
  total_score integer not null check (total_score between 0 and 108),
  risk_level text not null,
  domain_scores jsonb not null,
  completed_at timestamptz not null
);
create index if not exists reports_owner_date on public.reports(user_id, completed_at desc);
alter table public.reports enable row level security;
revoke all on public.reports from anon, authenticated;
grant select on public.reports to authenticated;
drop policy if exists reports_read on public.reports;
create policy reports_read on public.reports for select to authenticated
using (user_id = auth.uid() or public.is_report_admin());

-- Restrictive policies also constrain any pre-existing permissive policies.
alter table public.assessments enable row level security;
drop policy if exists assessment_read_boundary on public.assessments;
create policy assessment_read_boundary on public.assessments as restrictive for select to authenticated
using (user_id = auth.uid() or public.is_report_admin());
drop policy if exists assessment_insert_boundary on public.assessments;
create policy assessment_insert_boundary on public.assessments as restrictive for insert to authenticated
with check (user_id = auth.uid());
drop policy if exists assessment_owner_read on public.assessments;
create policy assessment_owner_read on public.assessments for select to authenticated using (user_id = auth.uid());
drop policy if exists assessment_owner_insert on public.assessments;
create policy assessment_owner_insert on public.assessments for insert to authenticated with check (user_id = auth.uid());
revoke update, delete on public.assessments from authenticated, anon;
revoke all on public.assessments from anon;

-- Recalculate in the database as well: callers cannot forge reported scores
-- by bypassing Express and using Supabase's public REST API.
create or replace function public.validate_assessment_scores() returns trigger
language plpgsql set search_path = '' as $$
declare
  question integer;
  answer integer;
  domain text;
  scores jsonb := '{"Emotional Health":0,"Stress & Anxiety":0,"Sleep & Energy":0,"Social Connection":0,"Daily Functioning":0}'::jsonb;
  total integer := 0;
begin
  for question in 1..27 loop
    if new.answers->>question::text is null or new.answers->>question::text !~ '^[0-4]$' then
      raise exception 'Invalid or missing assessment answer';
    end if;
    answer := (new.answers->>question::text)::integer;
    domain := case when question <= 6 then 'Emotional Health' when question <= 12 then 'Stress & Anxiety'
      when question <= 17 then 'Sleep & Energy' when question <= 22 then 'Social Connection' else 'Daily Functioning' end;
    total := total + answer;
    scores := jsonb_set(scores, array[domain], to_jsonb((scores->>domain)::integer + answer));
  end loop;
  new.total_score := total;
  new.domain_scores := scores;
  new.risk_level := case when total <= 35 then 'No Risk' when total <= 70 then 'Borderline' else 'At Risk' end;
  return new;
end;
$$;
revoke all on function public.validate_assessment_scores() from public;
drop trigger if exists assessment_validate_scores on public.assessments;
create trigger assessment_validate_scores before insert on public.assessments
for each row execute function public.validate_assessment_scores();

create or replace function public.snapshot_assessment_report() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.reports(assessment_id, user_id, user_details, total_score, risk_level, domain_scores, completed_at)
  select new.id, new.user_id,
    jsonb_build_object('firstName', coalesce(u.raw_user_meta_data->>'first_name', ''),
      'lastName', coalesce(u.raw_user_meta_data->>'last_name', ''),
      'email', coalesce(u.email, ''), 'phone', coalesce(u.raw_user_meta_data->>'phone', '')),
    new.total_score, new.risk_level, new.domain_scores, new.completed_at
  from auth.users u where u.id = new.user_id;
  return new;
end;
$$;
revoke all on function public.snapshot_assessment_report() from public;
drop trigger if exists assessment_report_snapshot on public.assessments;
create trigger assessment_report_snapshot after insert on public.assessments
for each row execute function public.snapshot_assessment_report();

-- Existing assessments receive snapshots using current profile details.
insert into public.reports(assessment_id, user_id, user_details, total_score, risk_level, domain_scores, completed_at)
select a.id, a.user_id,
  jsonb_build_object('firstName', coalesce(u.raw_user_meta_data->>'first_name', ''),
    'lastName', coalesce(u.raw_user_meta_data->>'last_name', ''),
    'email', coalesce(u.email, ''), 'phone', coalesce(u.raw_user_meta_data->>'phone', '')),
  a.total_score, a.risk_level, a.domain_scores, a.completed_at
from public.assessments a join auth.users u on u.id = a.user_id
on conflict (assessment_id) do nothing;
commit;
