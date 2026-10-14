/**
 * SIE ENEM — Ponto de partida
 * Liga as peças: menu, tema, selo da nuvem e roteador.
 */
import { MODULOS, GRUPOS, VERSAO_APP } from './core/modulos.js';
import { iniciarTema } from './core/tema.js';
import { iniciarRoteador } from './core/roteador.js';
import { escapar, $ } from './core/dom.js';
import { icone } from './ui/icones.js';
import { estadoSupabase } from './services/supabase.js';

function montarMenu() {
  const html = GRUPOS.map((grupo) => {
    const itens = MODULOS.filter((m) => m.grupo === grupo.id);
    if (!itens.length) return '';
    return `
      <div class="menu-grupo">
        <h2>${escapar(grupo.nome)}</h2>
        <ul>
          ${itens.map((m) => `
            <li>
              <a class="menu-link" href="#/${m.id}" data-modulo="${m.id}">
                ${icone(m.icone)}
                <span>${escapar(m.titulo)}</span>
                ${m.pronto ? '' : `<span class="menu-etapa" title="Previsto para a etapa ${m.etapa}">Etapa ${m.etapa}</span>`}
              </a>
            </li>`).join('')}
        </ul>
      </div>`;
  }).join('');
  $('#menu').innerHTML = html;
  $('#versao-app').textContent = `Versão ${VERSAO_APP} · etapa 1 de 8`;
}

function iniciarMenuCelular() {
  const app = $('#app');
  const botao = $('#abrir-menu');
  const veu = $('#veu');

  const desenhar = (aberto) => {
    botao.innerHTML = icone(aberto ? 'fechar' : 'menu');
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    app.classList.toggle('menu-aberto', aberto);
    veu.hidden = !aberto;
  };
  const fechar = () => desenhar(false);

  desenhar(false);
  botao.addEventListener('click', () => desenhar(!app.classList.contains('menu-aberto')));
  veu.addEventListener('click', fechar);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
  document.addEventListener('sie:navegou', fechar);
}

function atualizarSelo({ status }) {
  const selo = $('#selo-conexao');
  const textos = {
    verificando: 'Verificando nuvem…',
    'nao-configurado': 'Nuvem não configurada',
    configurado: 'Nuvem preparada',
    erro: 'Erro na configuração',
  };
  selo.dataset.estado = status;
  selo.textContent = textos[status] || status;
}

montarMenu();
iniciarMenuCelular();
iniciarTema($('#botao-tema'));
atualizarSelo(estadoSupabase());
document.addEventListener('sie:supabase', (e) => atualizarSelo(e.detail));
iniciarRoteador();
