/**
 * SIE ENEM — Página "em construção"
 * Usada por todos os módulos que ainda não foram desenvolvidos.
 * Mostra o que o módulo fará e em qual etapa ele entra.
 */
import { ETAPAS } from '../core/modulos.js';
import { escapar } from '../core/dom.js';

const arte = `
  <svg class="em-construcao-arte" viewBox="0 0 168 120" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-width="2">
      ${Array.from({ length: 15 }, (_, i) => {
        const x = 20 + (i % 5) * 32;
        const y = 20 + Math.floor(i / 5) * 40;
        return `<circle cx="${x}" cy="${y}" r="11"/>`;
      }).join('')}
    </g>
  </svg>`;

export function render(alvo, modulo) {
  const etapa = ETAPAS.find((e) => e.n === modulo.etapa);
  alvo.innerHTML = `
    <section class="painel em-construcao">
      <div style="display:grid;gap:var(--esp-4)">
        <h2>${escapar(modulo.titulo)}</h2>
        <p>${escapar(modulo.resumo)}</p>
        <p class="nota">Previsto para a etapa ${modulo.etapa}${etapa ? `: ${escapar(etapa.nome)}` : ''}.</p>
      </div>
      ${arte}
    </section>

    <section class="painel">
      <h3>O que esta área vai fazer</h3>
      <ul class="lista-simples">
        ${(modulo.planejado || []).map((item) => `<li>${escapar(item)}</li>`).join('')}
      </ul>
    </section>`;
}
