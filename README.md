# SIE ENEM — Sistema Inteligente de Estudos para o ENEM

Plataforma pessoal para organizar os estudos para o ENEM, acompanhar o progresso e analisar, com base em evidências, os temas que podem aparecer na prova.

**Versão atual:** 0.1.0 (etapa 1 de 8: base do projeto)

---

## O que já funciona

- Página inicial (dashboard) com o "cartão-resposta" das 180 questões, ainda em branco.
- Menu lateral com as 15 áreas do sistema, agrupadas por assunto.
- Troca de tema claro e escuro (a escolha fica salva no navegador).
- Layout para computador e celular (no celular, o menu vira uma gaveta).
- Páginas "em construção" para cada área, explicando o que ela fará e em qual etapa.
- Leitura da configuração do Supabase, com trava que recusa a chave secreta.

Nenhum dado real ou estatística existe ainda. Onde não há dados, a tela mostra um traço.

---

## Como abrir o projeto no seu computador

O site usa "módulos" de JavaScript, que **não funcionam se você abrir o `index.html` com dois cliques**. É preciso um pequeno servidor local. Escolha uma opção:

**Opção A: VS Code (mais fácil)**
1. Instale a extensão **Live Server** no VS Code.
2. Abra a pasta `sie-enem` no VS Code.
3. Clique com o botão direito no `index.html` e escolha **Open with Live Server**.

**Opção B: Python (se já tiver instalado)**
1. Abra o terminal dentro da pasta `sie-enem`.
2. Rode: `python -m http.server 8000`
3. Abra no navegador: `http://localhost:8000`

---

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo, `sie-enem`).
2. Envie todos os arquivos desta pasta para o repositório (o `index.html` precisa ficar na raiz).
3. No repositório: **Settings > Pages**.
4. Em **Source**, escolha **Deploy from a branch**; em **Branch**, escolha `main` e a pasta `/ (root)`; clique em **Save**.
5. Depois de 1 a 2 minutos, o site fica em `https://SEU-USUARIO.github.io/sie-enem/`.

O arquivo `.nojekyll` (vazio) já está incluído: ele avisa ao GitHub para publicar os arquivos exatamente como estão.

---

## Como conectar o Supabase (pode ser feito agora ou na etapa 2)

### 1. Criar o projeto
1. Acesse [supabase.com](https://supabase.com) e crie uma conta.
2. Clique em **New project**, dê um nome (ex.: `sie-enem`), crie uma senha forte para o banco e escolha a região **South America (São Paulo)**.

### 2. Pegar os dois dados de conexão
No painel do projeto: **Project Settings > API** (ou **API Keys**). Copie:
- **Project URL** (algo como `https://abcdefgh.supabase.co`)
- **Chave pública**: aparece como `anon` / `public` ou como `publishable` (começa com `sb_publishable_`)

### 3. Preencher a configuração
1. Na pasta `config`, faça uma cópia de `supabase.config.example.js`.
2. Renomeie a cópia para `supabase.config.js`.
3. Cole a URL e a chave pública nos campos.

### 4. Criar a tabela de perfis (na etapa 2)
No painel: **SQL Editor > New query**, cole o conteúdo de `supabase/migrations/001_perfis.sql` e clique em **Run**.

### 5. Liberar o endereço do site para o login
Em **Authentication > URL Configuration**:
- **Site URL**: `https://SEU-USUARIO.github.io/sie-enem/`
- **Redirect URLs**: adicione também `http://localhost:8000` (para testes no computador).

---

## Segurança: as duas chaves do Supabase

| Chave | Pode ir para o site? | Por quê |
|---|---|---|
| Pública (`anon` / `sb_publishable_...`) | **Sim** | Funciona como a chave da portaria: qualquer um vê, mas as regras RLS só deixam cada pessoa acessar os próprios dados. |
| Secreta (`service_role` / `sb_secret_...`) | **Nunca** | É a chave-mestra: ignora todas as regras. Se vazar, qualquer pessoa lê e apaga tudo. |

O sistema verifica a chave colada e **se recusa a funcionar** se for a secreta. Se isso acontecer, troque (rotacione) a chave secreta no painel do Supabase.

Por isso o `config/supabase.config.js` **pode** ser enviado ao GitHub: ele só contém dados públicos, e o GitHub Pages precisa dele para o site funcionar.

---

## Regras do projeto sobre previsões

1. Nenhuma probabilidade, estatística, fonte ou resultado de prova é inventado.
2. Dados de demonstração sempre aparecem com o selo **Demonstração** (veja `data/demo/LEIA-ME.md`).
3. Sem evidência suficiente, o sistema mostra "evidência insuficiente" em vez de um número.
4. **Probabilidade estimada de cobrança** e **prioridade de estudo** são medidas separadas e nunca aparecem misturadas.

---

## Onde fica cada coisa

Veja `docs/arquitetura.md` para o mapa completo das pastas e a explicação de como as peças se conectam.

## Histórico de versões

Veja `CHANGELOG.md`.
