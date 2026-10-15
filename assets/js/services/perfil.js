/**
 * SIE ENEM — Perfil da pessoa logada
 * Lê e grava a tabela "perfis" no Supabase. As regras RLS do banco
 * garantem que cada pessoa só alcance o próprio perfil.
 */
import { clienteSupabase } from './supabase.js';
import { usuarioAtual } from './auth.js';

let cache = null;

const avisar = () => document.dispatchEvent(new CustomEvent('sie:perfil', { detail: cache }));

document.addEventListener('sie:sessao', (e) => {
  if (!e.detail.usuario) { cache = null; avisar(); }
});

export function perfilEmCache() { return cache; }

export async function carregarPerfil({ forcar = false } = {}) {
  const usuario = usuarioAtual();
  const cliente = clienteSupabase();
  if (!usuario || !cliente) return null;
  if (cache && cache.id === usuario.id && !forcar) return cache;

  const { data, error } = await cliente
    .from('perfis')
    .select('id, nome_exibicao, tema, data_prova')
    .eq('id', usuario.id)
    .maybeSingle();
  if (error) throw error;

  // Se o perfil ainda não existir (ex.: conta criada antes da tabela), cria agora
  if (!data) {
    const novo = { id: usuario.id, nome_exibicao: usuario.nome || null };
    const { data: criado, error: erroCriar } = await cliente
      .from('perfis').insert(novo).select('id, nome_exibicao, tema, data_prova').single();
    if (erroCriar) throw erroCriar;
    cache = criado;
  } else {
    cache = data;
  }
  avisar();
  return cache;
}

export async function salvarPerfil(campos) {
  const usuario = usuarioAtual();
  const cliente = clienteSupabase();
  if (!usuario || !cliente) throw new Error('sem-login');

  const permitido = {};
  if ('nome_exibicao' in campos) permitido.nome_exibicao = (campos.nome_exibicao || '').trim().slice(0, 80) || null;
  if ('tema' in campos) permitido.tema = campos.tema;
  if ('data_prova' in campos) permitido.data_prova = campos.data_prova || null;

  const { data, error } = await cliente
    .from('perfis')
    .update(permitido)
    .eq('id', usuario.id)
    .select('id, nome_exibicao, tema, data_prova')
    .single();
  if (error) throw error;
  cache = data;
  avisar();
  return cache;
}
