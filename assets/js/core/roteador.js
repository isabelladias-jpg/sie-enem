/**
 * SIE ENEM — Roteador
 * ------------------------------------------------------------
 * Funciona como as "portas" entre os ambientes do sistema.
 * O endereço usa # (ex.: .../#/temas) porque o GitHub Pages não
 * tem servidor próprio: tudo acontece dentro de uma única página.
 *
 * Áreas marcadas com `exigeLogin` têm "porteiro": sem login, a
 * pessoa é levada para a tela Entrar e depois volta para onde ia.
 */
import { MODULOS, ROTA_INICIAL, buscarModulo, nomeDoGrupo } from './modulos.js';
import { escapar, $, $$ } from './dom.js';
import { authPronto, usuarioAtual } from '../services/auth.js';
import { estadoSupabase } from '../services/supabase.js';

const conteudo = () => $('#conteudo');

function lerRota() {
  const bruto = location.hash.replace(/^#\/?/, '');
  const [caminho, busca = ''] = bruto.split('?');
  return { id: caminho.split('/')[0] || ROTA_INICIAL, params: new URLSearchParams(busca) };
}

function marcarMenu(id) {
  $$('.menu-link').forEach((a) => {
    if (a.dataset.modulo === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function definirTitulo(modulo) {
  $('#titulo-pagina').textContent = modulo ? modulo.titulo : 'Página não encontrada';
  $('#topo-grupo').textContent = modulo && !modulo.oculto ? nomeDoGrupo(modulo.grupo) : '';
  document.title = `${modulo ? modulo.titulo : 'Página não encontrada'} · SIE ENEM`;
}

function telaSemNuvem(modulo) {
  conteudo().innerHTML = `
    <section class="painel">
      <h2>${escapar(modulo.titulo)}</h2>
      <div class="aviso">Esta área precisa de login, e o login depende da conexão com o Supabase,
        que ainda não foi configurada. Veja o passo a passo no README, seção "Como conectar o Supabase".</div>
    </section>`;
}

let execucao = 0;

async function navegar() {
  const { id, params } = lerRota();
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

  // Porteiro: áreas com dados pessoais exigem login
  if (modulo.exigeLogin) {
    conteudo().innerHTML = '<p class="nota">Verificando seu acesso…</p>';
    await authPronto;
    if (minhaExecucao !== execucao) return;
    if (estadoSupabase().status !== 'configurado') { telaSemNuvem(modulo); return; }
    if (!usuarioAtual()) {
      location.replace(`#/entrar?volta=${encodeURIComponent(id)}`);
      return;
    }
  }

  try {
    const arquivo = await modulo.carregar();
    if (minhaExecucao !== execucao) return; // a pessoa já mudou de página
    await arquivo.render(conteudo(), modulo, params);
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

  // Quando alguém entra ou sai, reavalia a página atual se ela depende disso
  let ultimoUsuario;
  document.addEventListener('sie:sessao', (e) => {
    const atual = e.detail.usuario?.id || null;
    if (ultimoUsuario === undefined) { ultimoUsuario = atual; return; }
    if (atual === ultimoUsuario) return;
    ultimoUsuario = atual;
    const modulo = buscarModulo(lerRota().id);
    if (modulo?.exigeLogin || modulo?.id === 'entrar' || modulo?.id === ROTA_INICIAL) navegar();
  });

  navegar();
}

export function irPara(id) { location.hash = `#/${id}`; }

export { MODULOS };
