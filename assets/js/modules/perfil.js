/**
 * SIE ENEM — Perfil e configurações
 * Nome, tema, data da prova, troca de senha e sair.
 */
import { escapar } from '../core/dom.js';
import { aplicarTema } from '../core/tema.js';
import { usuarioAtual, sair, definirNovaSenha, traduzirErro } from '../services/auth.js';
import { carregarPerfil, salvarPerfil } from '../services/perfil.js';

const TEMAS = [
  { valor: 'sistema', texto: 'Igual ao do aparelho' },
  { valor: 'claro', texto: 'Sempre claro' },
  { valor: 'escuro', texto: 'Sempre escuro' },
];

function mostrar(caixa, tipo, texto) {
  caixa.innerHTML = `<div class="aviso" data-tipo="${tipo}" role="status">${escapar(texto)}</div>`;
}

export async function render(alvo) {
  const usuario = usuarioAtual();
  alvo.innerHTML = '<p class="nota">Carregando seu perfil…</p>';

  let perfil;
  try {
    perfil = await carregarPerfil({ forcar: true });
  } catch (erro) {
    console.error('[SIE] Perfil:', erro);
    alvo.innerHTML = `
      <section class="painel">
        <h2>Perfil</h2>
        <div class="aviso" data-tipo="erro">Não foi possível carregar o perfil. Se for a primeira vez,
          confira se a tabela de perfis foi criada no Supabase (README, passo "Criar a tabela de perfis").</div>
      </section>`;
    return;
  }

  alvo.innerHTML = `
    <section class="painel">
      <div class="painel-cabeca">
        <h2 id="ola">Olá${perfil.nome_exibicao ? `, ${escapar(perfil.nome_exibicao)}` : ''}.</h2>
        <button class="botao" type="button" id="botao-sair">Sair da conta</button>
      </div>
      <p>Conta conectada: <strong>${escapar(usuario.email)}</strong></p>
    </section>

    <div class="grade-2">
      <section class="painel" aria-labelledby="t-dados">
        <h3 id="t-dados">Seus dados e preferências</h3>
        <form id="form-perfil" class="formulario" novalidate>
          <div class="campo">
            <label for="nome_exibicao">Como quer ser chamada(o)</label>
            <input id="nome_exibicao" name="nome_exibicao" type="text" maxlength="80" value="${escapar(perfil.nome_exibicao || '')}">
          </div>

          <fieldset class="campo">
            <legend>Tema</legend>
            <div class="opcoes">
              ${TEMAS.map((t) => `
                <label class="opcao">
                  <input type="radio" name="tema" value="${t.valor}" ${perfil.tema === t.valor ? 'checked' : ''}>
                  <span>${t.texto}</span>
                </label>`).join('')}
            </div>
          </fieldset>

          <div class="campo">
            <label for="data_prova">Data da sua prova (opcional)</label>
            <input id="data_prova" name="data_prova" type="date" value="${escapar(perfil.data_prova || '')}">
            <span class="nota">Confira a data oficial no site do INEP antes de preencher. O dashboard mostrará a contagem de dias.</span>
          </div>

          <div id="msg-perfil"></div>
          <button class="botao botao-principal" type="submit">Salvar alterações</button>
        </form>
      </section>

      <section class="painel" aria-labelledby="t-senha">
        <h3 id="t-senha">Trocar a senha</h3>
        <form id="form-senha" class="formulario" novalidate>
          <div class="campo">
            <label for="nova">Nova senha</label>
            <input id="nova" name="nova" type="password" minlength="8" autocomplete="new-password" required>
          </div>
          <div class="campo">
            <label for="nova2">Repita a nova senha</label>
            <input id="nova2" name="nova2" type="password" minlength="8" autocomplete="new-password" required>
          </div>
          <div id="msg-senha"></div>
          <button class="botao" type="submit">Trocar senha</button>
        </form>

        <h3>Privacidade</h3>
        <p class="nota">Guardamos só o necessário: nome de exibição, tema e data da prova. E-mail e senha ficam
          no sistema de login do Supabase. Exportar e apagar todos os seus dados entra na etapa 8 (Backup).</p>
      </section>
    </div>`;

  alvo.querySelector('#botao-sair').addEventListener('click', async (e) => {
    e.currentTarget.disabled = true;
    try { await sair(); location.hash = '#/entrar'; }
    catch (erro) { e.currentTarget.disabled = false; alert(traduzirErro(erro)); }
  });

  alvo.querySelector('#form-perfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const caixa = alvo.querySelector('#msg-perfil');
    const dados = Object.fromEntries(new FormData(form));
    const botao = form.querySelector('[type="submit"]');
    botao.disabled = true;
    try {
      const salvo = await salvarPerfil({
        nome_exibicao: dados.nome_exibicao,
        tema: dados.tema || 'sistema',
        data_prova: dados.data_prova,
      });
      aplicarTema(salvo.tema);
      alvo.querySelector('#ola').textContent = `Olá${salvo.nome_exibicao ? `, ${salvo.nome_exibicao}` : ''}.`;
      mostrar(caixa, 'ok', 'Alterações salvas.');
    } catch (erro) {
      console.error('[SIE] Salvar perfil:', erro);
      mostrar(caixa, 'erro', traduzirErro(erro));
    } finally {
      botao.disabled = false;
    }
  });

  alvo.querySelector('#form-senha').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const caixa = alvo.querySelector('#msg-senha');
    const { nova, nova2 } = Object.fromEntries(new FormData(form));
    if (nova.length < 8 || !/[a-zA-Z]/.test(nova) || !/\d/.test(nova)) { mostrar(caixa, 'erro', 'Use pelo menos 8 caracteres, misturando letras e números.'); return; }
    if (nova !== nova2) { mostrar(caixa, 'erro', 'As duas senhas não são iguais.'); return; }
    try {
      await definirNovaSenha(nova);
      form.reset();
      mostrar(caixa, 'ok', 'Senha trocada.');
    } catch (erro) {
      mostrar(caixa, 'erro', traduzirErro(erro));
    }
  });
}
