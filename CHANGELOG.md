# Changelog — SIE ENEM

Todas as mudanças importantes do projeto ficam registradas aqui.
Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e numeração [SemVer](https://semver.org/lang/pt-BR/):
`MAIOR.MENOR.CORREÇÃO` — enquanto o sistema estiver em construção, a versão começa com 0.

## [0.2.0] — 2026-10-14 · Etapa 2: login e perfil

### Adicionado
- Tela **Entrar** com quatro modos: entrar, criar conta, esqueci a senha e nova senha (pelo link do e-mail).
- Mensagens de erro do Supabase traduzidas para português simples.
- Validação de senha (mínimo 8 caracteres, com letras e números) e confirmação de senha.
- Página **Perfil e configurações**: nome, tema, data da prova, troca de senha e sair da conta.
- "Porteiro" no roteador: áreas marcadas com `exigeLogin` levam à tela Entrar e voltam depois do login.
- Botão da conta no topo (mostra "Entrar" ou o nome da pessoa).
- Tema salvo também no perfil, na nuvem, e aplicado ao entrar em qualquer aparelho.
- Dashboard com saudação, contagem de dias até a prova (data escolhida pela pessoa) e estado da conta.
- Serviços `auth.js` e `perfil.js`.

### Alterado
- Conexão com o Supabase usa o fluxo PKCE (mais seguro para sites sem servidor).
- Migração `001_perfis.sql`: o cadastro já grava o nome no perfil.
- Controle de tema passa a aceitar "igual ao do aparelho", "sempre claro" e "sempre escuro".

### Corrigido
- Pasta vazia `{assets` removida do pacote.

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
