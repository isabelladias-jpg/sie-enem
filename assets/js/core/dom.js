/**
 * SIE ENEM — Utilitários de tela
 * escapar(): impede que um texto vindo de fora (pesquisa importada,
 * nome digitado etc.) seja interpretado como código na página.
 * Regra: TODO dado do usuário ou importado passa por escapar().
 */

export function escapar(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
export const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];
