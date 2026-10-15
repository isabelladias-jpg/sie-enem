/**
 * SIE ENEM — Conexão com o Supabase
 * ------------------------------------------------------------
 * Lê o arquivo config/supabase.config.js. Se ele não existir ou
 * estiver vazio, o sistema funciona em "modo sem nuvem" e avisa.
 *
 * TRAVA DE SEGURANÇA: se alguém colar por engano a chave secreta
 * (service_role / sb_secret_...), o sistema se recusa a usá-la.
 */

// Versão fixa da biblioteca (nunca "latest"), carregada do CDN jsDelivr
const BIBLIOTECA = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/+esm';
const ARQUIVO_CONFIG = '../../../config/supabase.config.js';

const estado = {
  status: 'verificando', // verificando | nao-configurado | configurado | erro
  mensagem: '',
  cliente: null,
};

function papelDoJwt(chave) {
  try {
    const meio = chave.split('.')[1];
    if (!meio) return null;
    const json = atob(meio.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json).role || null;
  } catch {
    return null;
  }
}

export function chaveESecreta(chave) {
  return chave.startsWith('sb_secret_') || papelDoJwt(chave) === 'service_role';
}

function definir(status, mensagem) {
  estado.status = status;
  estado.mensagem = mensagem;
  document.dispatchEvent(new CustomEvent('sie:supabase', { detail: { ...estado } }));
}

async function carregarConfig() {
  try {
    const modulo = await import(ARQUIVO_CONFIG);
    return modulo.default || null;
  } catch {
    return null; // arquivo ainda não criado: comportamento esperado na etapa 1
  }
}

const pronto = (async () => {
  const config = await carregarConfig();
  const url = (config?.supabaseUrl || '').trim();
  const chave = (config?.supabaseChavePublica || '').trim();

  if (!url || !chave) {
    definir('nao-configurado', 'O arquivo config/supabase.config.js ainda não foi preenchido. O sistema funciona, mas sem login e sem salvar na nuvem.');
    return estado;
  }
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) {
    definir('erro', 'O endereço do Supabase parece incorreto. Ele deve ter o formato https://xxxxxxxx.supabase.co');
    return estado;
  }
  if (chaveESecreta(chave)) {
    definir('erro', 'A chave colada é a chave SECRETA (service_role). Ela nunca pode ficar no site. Use a chave pública (anon / publishable) e troque a secreta no painel do Supabase.');
    return estado;
  }

  try {
    const { createClient } = await import(BIBLIOTECA);
    estado.cliente = createClient(url.replace(/\/$/, ''), chave, {
      auth: {
        persistSession: true,      // continua logada ao fechar e abrir o navegador
        autoRefreshToken: true,    // renova a sessão sozinho
        detectSessionInUrl: true,  // entende os links de confirmação enviados por e-mail
        flowType: 'pkce',          // método mais seguro para sites sem servidor próprio
      },
    });
    definir('configurado', 'Conectado ao Supabase. Seus dados ficam salvos na sua conta.');
  } catch (erro) {
    console.error('[SIE] Não foi possível carregar a biblioteca do Supabase', erro);
    definir('erro', 'Não foi possível carregar a biblioteca do Supabase. Verifique a conexão com a internet.');
  }
  return estado;
})();

/** Aguarda a verificação terminar e devolve o estado. */
export function supabasePronto() { return pronto; }

/** Estado atual (pode ainda estar "verificando"). */
export function estadoSupabase() { return { ...estado }; }

/** Cliente do Supabase para os próximos módulos (null se não configurado). */
export function clienteSupabase() { return estado.cliente; }
