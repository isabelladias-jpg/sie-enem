# Changelog — SIE ENEM

Todas as mudanças importantes do projeto ficam registradas aqui.
Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e numeração [SemVer](https://semver.org/lang/pt-BR/):
`MAIOR.MENOR.CORREÇÃO` — enquanto o sistema estiver em construção, a versão começa com 0.

## [0.1.0] — 2026-10-14 · Etapa 1: base do projeto

### Adicionado
- Estrutura de pastas do projeto (HTML, CSS e JavaScript puros, sem frameworks).
- Página principal com menu lateral, topo com título da página e área de conteúdo.
- Navegação entre as 15 áreas do sistema por endereço com `#` (compatível com GitHub Pages).
- Cadastro central dos módulos em `assets/js/core/modulos.js` (menu e rotas gerados automaticamente).
- Dashboard com cartão-resposta das 180 questões (vazio), indicadores sem dados, gráfico vazio,
  quadro explicando a diferença entre probabilidade estimada e prioridade de estudo, e roteiro das 8 etapas.
- Página padrão "em construção" para os 14 módulos ainda não desenvolvidos.
- Tema claro e escuro, com botão de alternância e preferência salva no navegador.
- Layout responsivo (computador, tablet e celular, com menu em gaveta).
- Fontes Atkinson Hyperlegible e Bricolage Grotesque hospedadas no próprio site (sem Google Fonts).
- Serviço de conexão com o Supabase, com trava que recusa chave secreta e endereço inválido.
- Arquivo de configuração de exemplo do Supabase, sem credenciais.
- Migração SQL `001_perfis.sql` com políticas RLS (preparada, ainda não executada).
- Regras para dados de demonstração (`data/demo/LEIA-ME.md`) e selo visual "Demonstração".
- Identidade visual "Gabarito Silencioso" (filosofia e prancha em `docs/identidade-visual/`).
- README, documentação de arquitetura, `.gitignore`, `.nojekyll` e `404.html`.
