/**
 * SIE ENEM — Cadastro central dos módulos
 * ------------------------------------------------------------
 * Esta lista é a "planta" do sistema: o menu lateral e as rotas
 * são montados automaticamente a partir dela.
 *
 * Para criar um módulo novo no futuro:
 *   1. crie o arquivo em assets/js/modules/<id>.js (exportando render)
 *   2. troque `carregar` abaixo para apontar para ele
 *   3. mude a `etapa` / `pronto: true`
 *   4. se a área mostrar dados pessoais, marque `exigeLogin: true`
 */

export const VERSAO_APP = '0.2.0';

export const ETAPAS = [
  { n: 1, nome: 'Base do projeto, navegação e identidade visual' },
  { n: 2, nome: 'Login, perfil e conexão com o Supabase' },
  { n: 3, nome: 'Disciplinas, conteúdos, temas e histórico de provas' },
  { n: 4, nome: 'Plano de estudos, calendário, revisões e sessões' },
  { n: 5, nome: 'Simulados e desempenho' },
  { n: 6, nome: 'Central de pesquisas, fontes e importação' },
  { n: 7, nome: 'Probabilidades e prioridades dos temas' },
  { n: 8, nome: 'Relatórios, backup e restauração' },
];

export const ETAPA_ATUAL = 2;

const emConstrucao = () => import('../modules/em-construcao.js');

export const GRUPOS = [
  { id: 'inicio', nome: 'Visão geral' },
  { id: 'conteudo', nome: 'Conteúdo do ENEM' },
  { id: 'planejamento', nome: 'Planejamento' },
  { id: 'desempenho', nome: 'Desempenho' },
  { id: 'pesquisa', nome: 'Pesquisa e evidências' },
  { id: 'sistema', nome: 'Sistema' },
];

export const MODULOS = [
  {
    id: 'dashboard', titulo: 'Dashboard', grupo: 'inicio', icone: 'painel', etapa: 1, pronto: true,
    resumo: 'Visão geral do seu estudo.',
    carregar: () => import('../modules/dashboard.js'),
  },
  {
    id: 'disciplinas', titulo: 'Disciplinas e conteúdos', grupo: 'conteudo', icone: 'livro', etapa: 3,
    resumo: 'As quatro áreas do ENEM, suas disciplinas e os conteúdos de cada uma.',
    planejado: ['Cadastro das áreas e disciplinas', 'Lista de conteúdos por disciplina', 'Marcação do que já foi estudado'],
    carregar: emConstrucao,
  },
  {
    id: 'temas', titulo: 'Banco de temas e subtemas', grupo: 'conteudo', icone: 'camadas', etapa: 3,
    resumo: 'Os temas que podem cair na prova, organizados em níveis.',
    planejado: ['Temas ligados às disciplinas', 'Subtemas e palavras-chave', 'Busca e filtros'],
    carregar: emConstrucao,
  },
  {
    id: 'historico', titulo: 'Histórico de provas', grupo: 'conteudo', icone: 'arquivo', etapa: 3,
    resumo: 'O que já foi cobrado em provas anteriores, sempre com a fonte indicada.',
    planejado: ['Registro de provas por ano e aplicação', 'Ligação de cada questão a um tema', 'Fonte obrigatória para todo registro'],
    carregar: emConstrucao,
  },
  {
    id: 'plano', titulo: 'Plano de estudos', grupo: 'planejamento', icone: 'mapa', etapa: 4,
    resumo: 'Seu plano semanal, montado a partir das prioridades.',
    planejado: ['Metas por semana', 'Distribuição do tempo por área', 'Ajuste automático conforme o progresso'],
    carregar: emConstrucao,
  },
  {
    id: 'calendario', titulo: 'Calendário e revisões', grupo: 'planejamento', icone: 'calendario', etapa: 4,
    resumo: 'Datas de estudo e lembretes de revisão espaçada.',
    planejado: ['Calendário mensal e semanal', 'Revisões agendadas (1, 7 e 30 dias)', 'Contagem regressiva para a prova'],
    carregar: emConstrucao,
  },
  {
    id: 'sessoes', titulo: 'Sessões de estudo e progresso', grupo: 'planejamento', icone: 'relogio', etapa: 4,
    resumo: 'Registro do tempo estudado e do avanço em cada conteúdo.',
    planejado: ['Cronômetro de sessão', 'Histórico de sessões', 'Preenchimento do cartão-resposta do dashboard'],
    carregar: emConstrucao,
  },
  {
    id: 'simulados', titulo: 'Simulados e desempenho', grupo: 'desempenho', icone: 'alvo', etapa: 5,
    resumo: 'Resultados dos seus simulados e evolução por área.',
    planejado: ['Registro de acertos por área', 'Gráficos de evolução', 'Pontos fortes e fracos'],
    carregar: emConstrucao,
  },
  {
    id: 'relatorios', titulo: 'Relatórios', grupo: 'desempenho', icone: 'grafico', etapa: 8,
    resumo: 'Resumos do seu estudo para imprimir ou salvar.',
    planejado: ['Relatório semanal e mensal', 'Exportação em PDF'],
    carregar: emConstrucao,
  },
  {
    id: 'pesquisas', titulo: 'Central de pesquisas', grupo: 'pesquisa', icone: 'lupa', etapa: 6,
    resumo: 'Pesquisas feitas por você, pelo ChatGPT e pelo Gemini, lado a lado.',
    planejado: ['Registro de cada pesquisa e de quem a fez', 'Comparação entre ChatGPT, Gemini e suas anotações', 'Indicação de concordâncias e divergências'],
    carregar: emConstrucao,
  },
  {
    id: 'fontes', titulo: 'Fontes e evidências', grupo: 'pesquisa', icone: 'link', etapa: 6,
    resumo: 'De onde vem cada informação, com link e data de consulta.',
    planejado: ['Cadastro de fontes (INEP, provas, artigos)', 'Nível de confiança de cada fonte', 'Ligação entre evidências e temas'],
    carregar: emConstrucao,
  },
  {
    id: 'importacao', titulo: 'Importação de pesquisas', grupo: 'pesquisa', icone: 'importar', etapa: 6,
    resumo: 'Entrada organizada dos resultados das pesquisas.',
    planejado: ['Modelo de arquivo para importar', 'Validação antes de salvar', 'Recusa de dados sem fonte'],
    carregar: emConstrucao,
  },
  {
    id: 'probabilidades', titulo: 'Probabilidades dos temas', grupo: 'pesquisa', icone: 'balanca', etapa: 7,
    resumo: 'Estimativa de cobrança de cada tema, sempre separada da prioridade de estudo.',
    planejado: ['Probabilidade estimada com as evidências que a sustentam', 'Prioridade de estudo calculada à parte', 'Aviso claro quando não houver evidência suficiente'],
    carregar: emConstrucao,
  },
  {
    id: 'backup', titulo: 'Backup e restauração', grupo: 'sistema', icone: 'cofre', etapa: 8,
    resumo: 'Cópia de segurança dos seus dados.',
    planejado: ['Exportar tudo em um arquivo', 'Restaurar a partir do arquivo'],
    carregar: emConstrucao,
  },
  {
    id: 'perfil', titulo: 'Perfil e configurações', grupo: 'sistema', icone: 'pessoa', etapa: 2, pronto: true,
    exigeLogin: true,
    resumo: 'Sua conta, preferências e data da prova.',
    carregar: () => import('../modules/perfil.js'),
  },
];

/**
 * Páginas que existem mas NÃO aparecem no menu (ex.: tela de entrar).
 */
export const PAGINAS_OCULTAS = [
  {
    id: 'entrar', titulo: 'Entrar', grupo: 'sistema', oculto: true,
    carregar: () => import('../modules/entrar.js'),
  },
];

export const ROTA_INICIAL = 'dashboard';

export function buscarModulo(id) {
  return MODULOS.find((m) => m.id === id) || PAGINAS_OCULTAS.find((m) => m.id === id) || null;
}

export function nomeDoGrupo(id) {
  return GRUPOS.find((g) => g.id === id)?.nome || '';
}
