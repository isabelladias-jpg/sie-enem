/**
 * SIE ENEM — Tema claro / escuro
 * - Sem escolha salva: segue o tema do computador/celular.
 * - Ao clicar no botão: a escolha fica salva neste navegador.
 *   (Na etapa 2, a preferência também será salva no perfil, na nuvem.)
 */
import { icone } from '../ui/icones.js';

const CHAVE = 'sie-tema';
const raiz = document.documentElement;
const midiaEscura = window.matchMedia('(prefers-color-scheme: dark)');

function temaAtual() {
  const forcado = raiz.getAttribute('data-theme');
  if (forcado === 'dark') return 'escuro';
  if (forcado === 'light') return 'claro';
  return midiaEscura.matches ? 'escuro' : 'claro';
}

function aplicar(tema) {
  raiz.setAttribute('data-theme', tema === 'escuro' ? 'dark' : 'light');
  try { localStorage.setItem(CHAVE, tema); } catch { /* sem armazenamento: vale só nesta visita */ }
}

function desenharBotao(botao) {
  const escuro = temaAtual() === 'escuro';
  botao.setAttribute('aria-pressed', String(escuro));
  botao.title = escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro';
  botao.innerHTML = `${icone(escuro ? 'sol' : 'lua')}<span class="rotulo">${escuro ? 'Tema claro' : 'Tema escuro'}</span>`;
  botao.setAttribute('aria-label', botao.title);
}

export function iniciarTema(botao) {
  desenharBotao(botao);
  botao.addEventListener('click', () => {
    aplicar(temaAtual() === 'escuro' ? 'claro' : 'escuro');
    desenharBotao(botao);
  });
  midiaEscura.addEventListener('change', () => desenharBotao(botao));
}
