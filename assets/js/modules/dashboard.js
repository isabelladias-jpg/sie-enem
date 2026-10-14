/**
 * SIE ENEM — Dashboard
 * ------------------------------------------------------------
 * Etapa 1: nenhum dado real existe ainda, então TODOS os números
 * aparecem vazios ("—"). Nada é inventado.
 *
 * O cartão-resposta mostra as 180 questões objetivas do ENEM:
 *   1º dia: Linguagens (1–45) e Ciências Humanas (46–90) + Redação
 *   2º dia: Ciências da Natureza (91–135) e Matemática (136–180)
 * As bolinhas serão preenchidas pelo progresso real (etapa 4).
 */
import { ETAPAS, ETAPA_ATUAL } from '../core/modulos.js';
import { escapar } from '../core/dom.js';
import { supabasePronto, estadoSupabase } from '../services/supabase.js';

const AREAS = [
  { dia: 1, classe: 'area-linguagens', nome: 'Linguagens e Códigos', de: 1, ate: 45 },
  { dia: 1, classe: 'area-humanas', nome: 'Ciências Humanas', de: 46, ate: 90 },
  { dia: 2, classe: 'area-natureza', nome: 'Ciências da Natureza', de: 91, ate: 135 },
  { dia: 2, classe: 'area-matematica', nome: 'Matemática', de: 136, ate: 180 },
];

function blocoArea(area) {
  const bolinhas = [];
  for (let q = area.de; q <= area.ate; q++) {
    bolinhas.push(`<li class="bolinha" data-questao="${q}" data-estado="vazia" title="Questão ${q}"></li>`);
  }
  return `
    <div class="bloco ${area.classe}">
      <div class="bloco-cabeca">
        <span class="bloco-nome">${escapar(area.nome)}</span>
        <span class="bloco-faixa">questões ${area.de} a ${area.ate}</span>
      </div>
      <ol class="bolinhas" aria-label="${escapar(area.nome)}: 45 questões, nenhuma estudada ainda">${bolinhas.join('')}</ol>
    </div>`;
}

function cartaoResposta() {
  const dia1 = AREAS.filter((a) => a.dia === 1).map(blocoArea).join('');
  const dia2 = AREAS.filter((a) => a.dia === 2).map(blocoArea).join('');
  return `
    <div class="cartao" role="group" aria-label="Cartão-resposta das 180 questões do ENEM">
      <span class="cartao-dia">1º dia de prova</span>
      ${dia1}
      <div class="bloco bloco-redacao">
        <span class="bloco-nome">Redação</span>
        <span class="linhas-redacao" aria-hidden="true"></span>
      </div>
      <span class="cartao-dia">2º dia de prova</span>
      ${dia2}
    </div>`;
}

function indicador(rotulo, ajuda) {
  return `
    <div class="indicador">
      <span class="indicador-rotulo">${escapar(rotulo)}</span>
      <span class="indicador-valor" data-vazio>—</span>
      <span class="nota">${escapar(ajuda)}</span>
    </div>`;
}

function textoNuvem(estado) {
  const tipo = { configurado: 'ok', erro: 'erro' }[estado.status] || '';
  if (estado.status === 'verificando') return '<p class="nota">Verificando a configuração…</p>';
  return `<div class="aviso" ${tipo ? `data-tipo="${tipo}"` : ''}>${escapar(estado.mensagem)}</div>`;
}

const graficoVazio = `
  <div class="grafico-vazio">
    <svg viewBox="0 0 600 180" aria-hidden="true">
      <g stroke="currentColor" stroke-width="1">
        <line x1="40" y1="20" x2="590" y2="20" stroke-dasharray="3 5"/>
        <line x1="40" y1="70" x2="590" y2="70" stroke-dasharray="3 5"/>
        <line x1="40" y1="120" x2="590" y2="120" stroke-dasharray="3 5"/>
        <line x1="40" y1="165" x2="590" y2="165"/>
        <line x1="40" y1="15" x2="40" y2="165"/>
      </g>
    </svg>
    <p>O gráfico aparece quando houver sessões de estudo registradas.</p>
  </div>`;

export async function render(alvo) {
  alvo.innerHTML = `
    <section class="abertura" aria-labelledby="titulo-abertura">
      <div class="abertura-texto">
        <h2 id="titulo-abertura">Seu cartão-resposta ainda está em branco.</h2>
        <p>Cada bolinha representa uma das 180 questões objetivas do ENEM. Conforme você registrar estudos e simulados, elas serão preenchidas com o seu progresso real.</p>
        <p class="nota">Nenhum número desta tela é inventado: onde ainda não há dados, aparece um traço.</p>
      </div>
      ${cartaoResposta()}
    </section>

    <section class="painel" aria-labelledby="titulo-indicadores">
      <div class="painel-cabeca">
        <h3 id="titulo-indicadores">Seus números</h3>
        <span class="nota">Começam a contar na etapa 4</span>
      </div>
      <div class="grade-3">
        ${indicador('Horas estudadas', 'Somadas a partir das sessões de estudo.')}
        ${indicador('Conteúdos concluídos', 'Marcados por você em cada disciplina.')}
        ${indicador('Revisões pendentes', 'Calculadas pelo calendário de revisões.')}
      </div>
    </section>

    <div class="grade-2">
      <section class="painel" aria-labelledby="titulo-evolucao">
        <h3 id="titulo-evolucao">Evolução semanal</h3>
        ${graficoVazio}
      </section>

      <section class="painel" aria-labelledby="titulo-nuvem">
        <h3 id="titulo-nuvem">Sincronização na nuvem</h3>
        <div id="estado-nuvem">${textoNuvem(estadoSupabase())}</div>
        <p class="nota">Com o Supabase configurado, seus dados ficam guardados na sua conta e aparecem iguais no computador e no celular.</p>
      </section>
    </div>

    <section class="painel" aria-labelledby="titulo-medidas">
      <h3 id="titulo-medidas">Duas medidas que o sistema nunca mistura</h3>
      <div class="medidas">
        <div class="medida">
          <strong>Probabilidade estimada de cobrança</strong>
          <p>O quanto as evidências (provas anteriores, fontes, pesquisas) indicam que um tema pode aparecer na prova. Sempre vem acompanhada das fontes que a sustentam.</p>
        </div>
        <div class="medida">
          <strong>Prioridade de estudo</strong>
          <p>O quanto vale a pena você estudar aquele tema agora. Considera a probabilidade, mas também o seu desempenho e o tempo até a prova.</p>
        </div>
      </div>
      <p class="nota">Quando não houver evidência suficiente para um tema, o sistema mostrará "evidência insuficiente" em vez de um número.</p>
    </section>

    <section class="painel" aria-labelledby="titulo-roteiro">
      <div class="painel-cabeca">
        <h3 id="titulo-roteiro">Roteiro de construção</h3>
        <span class="nota">Etapa ${ETAPA_ATUAL} de ${ETAPAS.length}</span>
      </div>
      <ol class="roteiro">
        ${ETAPAS.map((e) => `
          <li data-estado="${e.n <= ETAPA_ATUAL ? 'pronta' : 'futura'}">
            <span class="roteiro-num">${e.n}</span>
            <span>${escapar(e.nome)}</span>
            <span class="roteiro-estado">${e.n <= ETAPA_ATUAL ? 'Pronta' : 'A fazer'}</span>
          </li>`).join('')}
      </ol>
    </section>`;

  const estado = await supabasePronto();
  const caixa = alvo.querySelector('#estado-nuvem');
  if (caixa) caixa.innerHTML = textoNuvem(estado);
}
