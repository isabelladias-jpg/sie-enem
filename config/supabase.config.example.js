/**
 * SIE ENEM — Configuração do Supabase (EXEMPLO, sem credenciais reais)
 * ---------------------------------------------------------------------
 * COMO USAR:
 *   1. Copie este arquivo e renomeie a cópia para:  supabase.config.js
 *      (na mesma pasta /config)
 *   2. Preencha os dois campos abaixo com os dados do SEU projeto.
 *      Onde encontrar: painel do Supabase > Project Settings > API
 *
 * O QUE PODE e O QUE NUNCA PODE ir aqui:
 *   ✅ Project URL ...................... https://xxxxxxxx.supabase.co
 *   ✅ Chave pública (anon ou publishable) ... é como a chave da portaria:
 *      qualquer pessoa vê, mas só entra onde as regras (RLS) deixam.
 *   ❌ Chave secreta (service_role ou sb_secret_...) ... é a chave-mestra.
 *      NUNCA coloque aqui. O sistema detecta e se recusa a usar.
 */
export default {
  supabaseUrl: '',
  supabaseChavePublica: '',
};
