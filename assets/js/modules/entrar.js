/**
 * SIE ENEM — Página "Entrar"
 * Quatro modos na mesma tela:
 *   entrar | criar | esqueci | nova-senha (chega pelo link do e-mail)
 */
import { escapar } from '../core/dom.js';
import { ROTA_INICIAL, buscarModulo } from '../core/modulos.js';
import { estadoSupabase, supabasePronto } from '../services/supabase.js';
import {
  authPronto, usuarioAtual, estaEmRecuperacao, traduzirErro,
  entrar, cadastrar, pedirNovaSenha, definirNovaSenha,
} from '../services/auth.js';

const MODOS = {
  entrar: { titulo: 'Entrar na sua conta', botao: 'Entrar' },
  criar: { titulo: 'Criar sua conta', botao: 'Criar conta' },
  esqueci: { titulo: 'Recuperar a senha', botao: 'Enviar link por e-mail' },
  'nova-senha': { titulo: 'Escolha uma nova senha', botao: 'Salvar nova senha' },
};

const campo = (id, rotulo, tipo, extra = '') => `
  <div class="campo">
    <label for="${id}">${rotulo}</label>
    <input id="${id}" name="${id}" type="${tipo}" required ${extra}>
  </div>`;

function camposDo(modo) {
  if (modo === 'entrar') return campo('email', 'E-mail', 'email', 'autocomplete="email"')
    + campo('senha', 'Senha', 'password', 'autocomplete="current-password"');
  if (modo === 'criar') return campo('nome', 'Como quer ser chamada(o)', 'text', 'autocomplete="nickname" maxlength="80"')
    + campo('email', 'E-mail', 'email', 'autocomplete="email"')
    + campo('senha', 'Senha', 'password', 'autocomplete="new-password" minlength="8"')
    + campo('senha2', 'Repita a senha', 'password', 'autocomplete="new-password" minlength="8"')
    + '<p class="nota">Use pelo menos 8 caracteres, misturando letras e números.</p>';
  if (modo === 'esqueci') return campo('email', 'E-mail da sua conta', 'email', 'autocomplete="email"');
  return campo('senha', 'Nova senha', 'password', 'autocomplete="new-password" minlength="8"')
    + campo('senha2', 'Repita a nova senha', 'password', 'autocomplete="new-password" minlength="8"');
}

function abas(modo) {
  if (modo === 'nova-senha') return '';
  const item = (m, texto) => `<button type="button" class="aba" data-modo="${m}" aria-pressed="${m === modo}">${texto}</button>`;
  return `<div class="abas" role="group" aria-label="Escolha o que fazer">${item('entrar', 'Entrar')}${item('criar', 'Criar conta')}</div>`;
}

function desenhar(alvo, modo, mensagem = null) {
  const m = MODOS[modo];
  alvo.innerHTML = `
    <section class="entrada">
      <div class="entrada-lado">
        <h2>Seu estudo, guardado com você.</h2>
        <p>Com a conta, o que você registrar fica salvo na nuvem e aparece igual no computador e no celular.</p>
        <p class="nota">Só você enxerga os seus dados: o banco tem regras que impedem qualquer outra conta de acessá-los.</p>
        <div class="entrada-bolinhas" aria-hidden="true">${'<span></span>'.repeat(18)}</div>
      </div>

      <div class="entrada-form">
        ${abas(modo)}
        <h3>${m.titulo}</h3>
        ${mensagem ? `<div class="aviso" data-tipo="${mensagem.tipo}" role="status">${escapar(mensagem.texto)}</div>` : ''}
        <form id="form-entrada" novalidate>
          ${camposDo(modo)}
          <button class="botao botao-principal botao-largo" type="submit">${m.botao}</button>
        </form>
        ${modo === 'entrar' ? '<button type="button" class="link-botao" data-modo="esqueci">Esqueci minha senha</button>' : ''}
        ${modo === 'esqueci' ? '<button type="button" class="link-botao" data-modo="entrar">Voltar para Entrar</button>' : ''}
      </div>
    </section>`;

  alvo.querySelectorAll('[data-modo]').forEach((b) => b.addEventListener('click', () => desenhar(alvo, b.dataset.modo)));
  alvo.querySelector('#form-entrada').addEventListener('submit', (e) => enviar(e, alvo, modo));
  alvo.querySelector('input')?.focus();
}

function validar(modo, dados) {
  if ('email' in dados && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) return 'Digite um e-mail válido.';
  if (modo === 'criar' && !dados.nome) return 'Digite como quer ser chamada(o).';
  if ((modo === 'criar' || modo === 'nova-senha')) {
    if (dados.senha.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.';
    if (!/[a-zA-Z]/.test(dados.senha) || !/\d/.test(dados.senha)) return 'Misture letras e números na senha.';
    if (dados.senha !== dados.senha2) return 'As duas senhas não são iguais.';
  }
  if (modo === 'entrar' && !dados.senha) return 'Digite a sua senha.';
  return null;
}

async function enviar(evento, alvo, modo) {
  evento.preventDefault();
  const form = evento.currentTarget;
  const dados = Object.fromEntries(new FormData(form));
  Object.keys(dados).forEach((k) => { if (k !== 'senha' && k !== 'senha2') dados[k] = String(dados[k]).trim(); });

  const problema = validar(modo, dados);
  if (problema) { desenharMantendo(alvo, modo, { tipo: 'erro', texto: problema }, dados); return; }

  const botao = form.querySelector('button[type="submit"]');
  botao.disabled = true;
  botao.textContent = 'Aguarde…';

  try {
    if (modo === 'entrar') {
      await entrar({ email: dados.email, senha: dados.senha });
      // o roteador recebe o aviso de login e leva para a página certa
    } else if (modo === 'criar') {
      const { precisaConfirmar } = await cadastrar({ nome: dados.nome, email: dados.email, senha: dados.senha });
      if (precisaConfirmar) {
        desenhar(alvo, 'entrar', {
          tipo: 'ok',
          texto: `Conta criada! Enviamos um link de confirmação para ${dados.email}. Abra o e-mail (veja também o spam), clique no link e depois entre aqui.`,
        });
      }
    } else if (modo === 'esqueci') {
      await pedirNovaSenha(dados.email);
      desenhar(alvo, 'entrar', {
        tipo: 'ok',
        texto: 'Se existir uma conta com esse e-mail, enviamos um link para criar uma nova senha. Abra o link neste mesmo navegador.',
      });
    } else {
      await definirNovaSenha(dados.senha);
      location.hash = `#/${ROTA_INICIAL}`;
    }
  } catch (erro) {
    console.warn('[SIE] Login:', erro);
    desenharMantendo(alvo, modo, { tipo: 'erro', texto: traduzirErro(erro) }, dados);
  }
}

/** Redesenha com a mensagem, mas devolve o que a pessoa digitou (menos as senhas). */
function desenharMantendo(alvo, modo, mensagem, dados) {
  desenhar(alvo, modo, mensagem);
  ['nome', 'email'].forEach((k) => {
    const input = alvo.querySelector(`#${k}`);
    if (input && dados[k]) input.value = dados[k];
  });
}

export async function render(alvo, _modulo, params) {
  await supabasePronto();
  if (estadoSupabase().status !== 'configurado') {
    alvo.innerHTML = `
      <section class="painel">
        <h2>Entrar</h2>
        <div class="aviso">O login ainda não está disponível porque a conexão com o Supabase não foi configurada.
          Siga o README, seção "Como conectar o Supabase".</div>
      </section>`;
    return;
  }

  await authPronto;
  const modoPedido = params?.get('modo');
  const recuperando = modoPedido === 'nova-senha' && (estaEmRecuperacao() || usuarioAtual());

  if (usuarioAtual() && !recuperando) {
    const volta = params?.get('volta');
    location.replace(`#/${volta && buscarModulo(volta) ? volta : ROTA_INICIAL}`);
    return;
  }

  desenhar(alvo, recuperando ? 'nova-senha' : 'entrar');
}
