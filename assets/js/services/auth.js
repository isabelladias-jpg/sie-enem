/**
 * SIE ENEM — Login (cadastro, entrar, sair, senha)
 * ------------------------------------------------------------
 * Funciona como a "portaria" do sistema. Guarda quem está logado
 * e avisa o resto do site (evento "sie:sessao") quando isso muda.
 */
import { supabasePronto, clienteSupabase } from './supabase.js';

let sessao = null;
let emRecuperacao = false;

const avisar = () => document.dispatchEvent(new CustomEvent('sie:sessao', { detail: { usuario: usuarioAtual() } }));

/** Endereço para onde os links dos e-mails devem voltar (a página principal do site). */
function enderecoDoSite() {
  return location.origin + location.pathname;
}

/** Traduz as mensagens do Supabase para português simples. */
export function traduzirErro(erro) {
  const msg = (erro?.message || String(erro || '')).toLowerCase();
  if (msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (msg.includes('email not confirmed')) return 'Seu e-mail ainda não foi confirmado. Abra o link que enviamos para a sua caixa de entrada (veja também o spam).';
  if (msg.includes('user already registered') || msg.includes('already been registered')) return 'Já existe uma conta com este e-mail. Use "Entrar" ou "Esqueci minha senha".';
  if (msg.includes('password should be at least') || msg.includes('weak password')) return 'A senha é fraca. Use pelo menos 8 caracteres, misturando letras e números.';
  if (msg.includes('unable to validate email') || msg.includes('invalid format') || msg.includes('email address') && msg.includes('invalid')) return 'Este e-mail não parece válido. Confira se foi digitado corretamente.';
  if (msg.includes('rate limit') || msg.includes('security purposes') || msg.includes('too many')) return 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.';
  if (msg.includes('same password') || msg.includes('different from the old')) return 'A nova senha precisa ser diferente da atual.';
  if (msg.includes('code verifier') || msg.includes('auth code') || msg.includes('flow state')) return 'Este link precisa ser aberto no mesmo navegador em que você fez o pedido. Faça o pedido de novo e abra o e-mail neste mesmo navegador.';
  if (msg.includes('failed to fetch') || msg.includes('network')) return 'Sem conexão com a internet ou com o Supabase. Verifique sua conexão.';
  if (msg.includes('signups not allowed') || msg.includes('signup is disabled')) return 'Novos cadastros estão desativados no Supabase (Authentication > Sign In / Providers).';
  return 'Não foi possível concluir. Tente de novo em instantes.';
}

function exigirCliente() {
  const cliente = clienteSupabase();
  if (!cliente) throw new Error('nuvem-nao-configurada');
  return cliente.auth;
}

export function usuarioAtual() {
  const u = sessao?.user;
  if (!u) return null;
  return { id: u.id, email: u.email, nome: u.user_metadata?.nome_exibicao || '' };
}

export function estaEmRecuperacao() { return emRecuperacao; }

/** Prepara a portaria: lê a sessão salva e passa a escutar mudanças. */
export const authPronto = (async () => {
  await supabasePronto();
  const cliente = clienteSupabase();
  if (!cliente) return null;

  cliente.auth.onAuthStateChange((evento, novaSessao) => {
    sessao = novaSessao;
    if (evento === 'PASSWORD_RECOVERY') {
      emRecuperacao = true;
      location.hash = '#/entrar?modo=nova-senha';
    }
    // Avisar fora do callback (recomendação do Supabase para evitar travamentos)
    setTimeout(avisar, 0);
  });

  const { data } = await cliente.auth.getSession();
  sessao = data.session;
  avisar();
  return usuarioAtual();
})();

export async function cadastrar({ nome, email, senha }) {
  const auth = exigirCliente();
  const { data, error } = await auth.signUp({
    email,
    password: senha,
    options: {
      emailRedirectTo: enderecoDoSite(),
      data: { nome_exibicao: nome },
    },
  });
  if (error) throw error;
  // Com confirmação de e-mail ligada, não há sessão até a pessoa clicar no link
  return { precisaConfirmar: !data.session };
}

export async function entrar({ email, senha }) {
  const { error } = await exigirCliente().signInWithPassword({ email, password: senha });
  if (error) throw error;
}

export async function sair() {
  const { error } = await exigirCliente().signOut();
  if (error) throw error;
}

export async function pedirNovaSenha(email) {
  const { error } = await exigirCliente().resetPasswordForEmail(email, { redirectTo: enderecoDoSite() });
  if (error) throw error;
}

export async function definirNovaSenha(senha) {
  const { error } = await exigirCliente().updateUser({ password: senha });
  if (error) throw error;
  emRecuperacao = false;
}
