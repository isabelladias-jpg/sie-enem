# Arquitetura do SIE ENEM

## A ideia em uma frase

O site é uma **casa pré-fabricada entregue pronta** (GitHub Pages) que se conecta a um **cofre na nuvem** (Supabase). Não existe um servidor próprio no meio: o navegador conversa direto com o cofre, e o cofre decide, pelas regras RLS, o que cada pessoa pode ver.

```
  Você (navegador: computador ou celular)
        │  abre o site
        ▼
  GitHub Pages  ── entrega HTML, CSS, JS, fontes e imagens (arquivos fixos)
        │
        │  o JavaScript do site conversa direto com…
        ▼
  Supabase
   ├─ Login (Auth) ........ cadastro, senha, sessão
   ├─ Banco (Postgres) .... estudos, temas, fontes, pesquisas
   └─ Regras RLS .......... "cada pessoa só acessa as próprias linhas"
```

## Mapa das pastas

```
sie-enem/
├── index.html              Casca do sistema: menu, topo e área de conteúdo
├── 404.html                Devolve para a página principal se o endereço não existir
├── .nojekyll               Avisa o GitHub Pages para publicar os arquivos como estão
├── README.md               Como abrir, publicar e configurar
├── CHANGELOG.md            Histórico de versões
│
├── assets/
│   ├── css/
│   │   ├── tokens.css      Paleta oficial: cores, fontes, espaçamentos, temas claro/escuro
│   │   ├── base.css        Regras gerais (texto, links, foco do teclado)
│   │   ├── layout.css      "Planta baixa": menu, topo, conteúdo, versão celular
│   │   └── components.css  Peças reutilizáveis: botões, painéis, cartão-resposta, tabelas
│   ├── fonts/              Fontes hospedadas no próprio site
│   ├── img/                Logo e ícone da aba
│   └── js/
│       ├── app.js          Ponto de partida: liga todas as peças
│       ├── core/
│       │   ├── modulos.js  ★ Cadastro das 15 áreas e das 8 etapas (o "índice" do sistema)
│       │   ├── roteador.js Troca de página pelo endereço (#/dashboard, #/temas…)
│       │   ├── tema.js     Tema claro/escuro
│       │   └── dom.js      Proteção contra textos maliciosos (escapar)
│       ├── services/
│       │   ├── supabase.js Conexão com a nuvem + trava contra chave secreta
│       │   ├── auth.js     Portaria: cadastro, entrar, sair, senha
│       │   └── perfil.js   Ler e salvar o perfil (nome, tema, data da prova)
│       ├── modules/
│       │   ├── dashboard.js       Página inicial
│       │   ├── entrar.js          Tela de login e cadastro
│       │   ├── perfil.js          Perfil e configurações
│       │   └── em-construcao.js   Página padrão das áreas futuras
│       └── ui/
│           └── icones.js   Ícones desenhados em SVG
│
├── config/
│   └── supabase.config.example.js   Modelo de configuração (sem credenciais)
│
├── supabase/
│   └── migrations/
│       └── 001_perfis.sql  Tabela de perfis + regras RLS (para a etapa 2)
│
├── data/demo/              Futuros dados de demonstração (sempre identificados)
└── docs/
    ├── arquitetura.md      Este documento
    └── identidade-visual/  Filosofia "Gabarito Silencioso" e prancha visual
```

## Como uma área nova entra no sistema

1. Criar o arquivo `assets/js/modules/<nome>.js` com uma função `render`.
2. Em `core/modulos.js`, apontar o `carregar` daquela área para o arquivo novo e marcar `pronto: true`.
3. Se precisar guardar dados, criar uma nova migração em `supabase/migrations/` **sempre com RLS ligado**.
4. Registrar a mudança no `CHANGELOG.md` e subir a versão.

O menu, as rotas e o título da página se ajustam sozinhos.

## Padrão das tabelas futuras (todas com RLS)

Toda tabela com dados pessoais terá a coluna `usuario_id` ligada à conta e as mesmas quatro regras: ler, criar, alterar e apagar **somente as próprias linhas**.

Para as previsões, a separação será feita já no banco:

| Campo previsto | Significado |
|---|---|
| `probabilidade_estimada` | Quanto as evidências indicam que o tema pode cair (vazio quando não houver evidência suficiente) |
| `nivel_evidencia` | `insuficiente`, `fraca`, `moderada` ou `forte` |
| `prioridade_estudo` | Quanto vale estudar agora (calculada à parte, considerando também o seu desempenho) |
| `fontes` | Ligação obrigatória com a tabela de fontes |
| `demonstracao` | `true` para qualquer dado fictício de teste |

## LGPD

- Guardar só o mínimo necessário (nome de exibição e preferências; e-mail e senha ficam no login do Supabase).
- Fontes hospedadas no próprio site, para o navegador não enviar dados ao Google a cada visita.
- Backup (etapa 8) permitirá exportar e apagar os próprios dados.
