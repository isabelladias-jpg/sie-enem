-- =====================================================================
-- SIE ENEM — Migração 001: tabela de perfis com segurança RLS
-- Status: usada a partir da etapa 2 (login e perfil).
--
-- Como executar: painel do Supabase > SQL Editor > New query >
-- cole este arquivo inteiro > Run.
--
-- LGPD: guardamos apenas o mínimo necessário (nome de exibição,
-- preferências). E-mail e senha ficam no sistema de login do próprio
-- Supabase (auth.users), não nesta tabela.
-- =====================================================================

create table if not exists public.perfis (
  id              uuid primary key references auth.users (id) on delete cascade,
  nome_exibicao   text check (char_length(nome_exibicao) <= 80),
  tema            text not null default 'sistema' check (tema in ('claro', 'escuro', 'sistema')),
  data_prova      date,
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

-- Liga a "fechadura": sem política, ninguém lê nem grava nada.
alter table public.perfis enable row level security;

-- Cada pessoa só enxerga, cria e altera o PRÓPRIO perfil.
create policy "perfil: ler o proprio"
  on public.perfis for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "perfil: criar o proprio"
  on public.perfis for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "perfil: alterar o proprio"
  on public.perfis for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Não há política de DELETE: o perfil só some se a conta for excluída.

-- Atualiza "atualizado_em" automaticamente a cada alteração
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists perfis_atualizado_em on public.perfis;
create trigger perfis_atualizado_em
  before update on public.perfis
  for each row execute function public.tocar_atualizado_em();

-- Cria o perfil vazio automaticamente quando alguém se cadastra
create or replace function public.criar_perfil_ao_cadastrar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfis (id, nome_exibicao)
  values (new.id, left(nullif(trim(new.raw_user_meta_data ->> 'nome_exibicao'), ''), 80))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists ao_cadastrar_usuario on auth.users;
create trigger ao_cadastrar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil_ao_cadastrar();
