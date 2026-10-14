/**
 * SIE ENEM — Roteador
 * ------------------------------------------------------------
 * Funciona como as "portas" entre os ambientes do sistema.
 * O endereço usa # (ex.: .../#/temas) porque o GitHub Pages não
 * tem servidor próprio: tudo acontece dentro de uma única página.
 */
import { MODULOS, ROTA_INICIAL, buscarModulo, nomeDoGrupo } from './modulos.js';
import { escapar, $, $$ } from './dom.js';

const conteudo = () => $('#conteudo');

function idDaRota() {
  const bruto = location.hash.replace(/^#\/?/, '').split(/[/?]/)[0];
  return bruto || ROTA_INICIAL;
}

function marcarMenu(id) {
  $$('.menu-link').forEach((a) => {
    if (a.dataset.modulo === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function definirTitulo(modulo) {
  $('#titulo-pagina').textContent = modulo ? modulo.titulo : 'Página não encontrada';
  $('#topo-grupo').textContent = modulo ? nomeDoGrupo(modulo.grupo) : '';
  document.title = `${modulo ? modulo.titulo : 'Página não encontrada'} · SIE ENEM`;
}

let execucao = 0;

async function navegar() {
  const id = idDaRota();
  const modulo = buscarModulo(id);
  const minhaExecucao = ++execucao;

  definirTitulo(modulo);
  marcarMenu(id);
  document.dispatchEvent(new CustomEvent('sie:navegou'));

  if (!modulo) {
    conteudo().innerHTML = `
      <section class="painel">
        <h2>Esta página não existe</h2>
        <p>O endereço <code>#/${escapar(id)}</code> não corresponde a nenhuma área do sistema.</p>
        <p><a class="botao botao-principal" href="#/${ROTA_INICIAL}">Voltar ao dashboard</a></p>
      </section>`;
    return;
  }

  try {
    const arquivo = await modulo.carregar();
    if (minhaExecucao !== execucao) return; // a pessoa já mudou de página
    await arquivo.render(conteudo(), modulo);
  } catch (erro) {
    console.error('[SIE] Falha ao abrir o módulo', id, erro);
    conteudo().innerHTML = `
      <section class="aviso" data-tipo="erro" role="alert">
        Não foi possível abrir <strong>${escapar(modulo.titulo)}</strong>. Recarregue a página;
        se o problema continuar, veja o console do navegador (F12).
      </section>`;
  }
  if (document.activeElement?.classList.contains('menu-link')) conteudo().focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
}

export function iniciarRoteador() {
  if (!location.hash) history.replaceState(null, '', `#/${ROTA_INICIAL}`);
  window.addEventListener('hashchange', navegar);
  navegar();
}

export { MODULOS };
