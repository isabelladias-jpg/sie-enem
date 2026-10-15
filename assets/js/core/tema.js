/**
 * SIE ENEM — Tema claro / escuro
 * - "sistema": segue o tema do computador/celular (padrão).
 * - "claro" / "escuro": escolha fixa.
 * A escolha fica salva neste navegador e, com login, também no perfil
 * na nuvem (o evento "sie:tema-alterado" avisa o app para salvar).
 */
import { icone } from '../ui/icones.js';

const CHAVE = 'sie-tema';
const raiz = document.documentElement;
const midiaEscura = window.matchMedia('(prefers-color-scheme: dark)');
let botaoTema = null;

function temaVisivel() {
  const forcado = raiz.getAttribute('data-theme');
  if (forcado === 'dark') return 'escuro';
  if (forcado === 'light') return 'claro';
  return midiaEscura.matches ? 'escuro' : 'claro';
}

export function temaEscolhido() {
  try { return localStorage.getItem(CHAVE) || 'sistema'; } catch { return 'sistema'; }
}

/** Aplica uma preferência: 'claro', 'escuro' ou 'sistema'. */
export function aplicarTema(tema) {
  if (tema === 'escuro') raiz.setAttribute('data-theme', 'dark');
  else if (tema === 'claro') raiz.setAttribute('data-theme', 'light');
  else raiz.removeAttribute('data-theme');
  try {
    if (tema === 'sistema') localStorage.removeItem(CHAVE);
    else localStorage.setItem(CHAVE, tema);
  } catch { /* sem armazenamento: vale só nesta visita */ }
  if (botaoTema) desenharBotao(botaoTema);
}

function desenharBotao(botao) {
  const escuro = temaVisivel() === 'escuro';
  botao.setAttribute('aria-pressed', String(escuro));
  botao.title = escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro';
  botao.innerHTML = `${icone(escuro ? 'sol' : 'lua')}<span class="rotulo">${escuro ? 'Tema claro' : 'Tema escuro'}</span>`;
  botao.setAttribute('aria-label', botao.title);
}

export function iniciarTema(botao) {
  botaoTema = botao;
  desenharBotao(botao);
  botao.addEventListener('click', () => {
    const novo = temaVisivel() === 'escuro' ? 'claro' : 'escuro';
    aplicarTema(novo);
    document.dispatchEvent(new CustomEvent('sie:tema-alterado', { detail: { tema: novo } }));
  });
  midiaEscura.addEventListener('change', () => desenharBotao(botao));
}
