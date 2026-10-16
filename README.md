# Matrix Old Games — site

Site estático (HTML, CSS e um pouco de JavaScript), sem banco de dados e sem programa para compilar.
Funciona de graça no GitHub Pages com o domínio **www.matrixoldgames.com.br**.

## Estrutura

```
index.html        Início
traducoes.html    Catálogo de traduções (filtro por plataforma)
shenmue.html      Página da tradução do Shenmue
apoie.html        Doações (Pix e outras plataformas)
sobre.html        Sobre o projeto, MatrixHK e como participar
404.html          Página de "não encontrada"
css/estilo.css    Visual do site
js/dados.js       <- O ARQUIVO QUE VOCÊ EDITA
js/site.js        Monta as partes dinâmicas a partir do dados.js
assets/           Logos, favicon e imagens
CNAME             Domínio usado pelo GitHub Pages
```

## O dia a dia: só o `js/dados.js`

Tudo que muda com frequência está nesse arquivo:

- **Status de cada disco**: em `etapas`, use `"ok"`, `"andamento"` ou `"pendente"`.
  A barra de progresso, os selos e o texto "1 de 3 discos lançados" se atualizam sozinhos.
- **Link de download**: preencha `download` (e `espelho`, se quiser) do disco.
  Enquanto estiver vazio, o botão mostra "Em breve".
- **Versão**: atualize `versao` do disco e adicione uma entrada no `changelog`.
- **Pix e plataformas de doação**: em `apoio`. Campos vazios ficam escondidos no site.
- **Discord e YouTube**: em `contato`. Vazios ficam escondidos.
- **Hash do GDI original**: em `base.hash` (MD5). Ajuda as pessoas a conferirem a versão antes de aplicar o patch.

### Prints de antes e depois

1. Salve os prints em `assets/jogos/` (ex.: `shenmue-01-en.png` e `shenmue-01-pt.png`), mesmo tamanho e enquadramento.
2. Em `prints`, adicione:
   `{ antes: "assets/jogos/shenmue-01-en.png", depois: "assets/jogos/shenmue-01-pt.png", legenda: "Menu de itens" }`

O site cria um comparador de arrastar automaticamente.

### Capa do card no catálogo

Coloque uma imagem em `assets/jogos/` e preencha `capa`. Use arte própria (montagem com prints traduzidos, por exemplo), não a capa ou o logo oficial do jogo.

## Adicionar um jogo novo

1. Em `js/dados.js`, copie o bloco do Shenmue dentro de `traducoes` e mude `id`, `pagina`, `titulo`, `plataforma` etc.
2. Copie `shenmue.html` com o novo nome (ex.: `shenmue2.html`).
3. No novo arquivo, troque `data-jogo="shenmue"` pelo novo `id` e ajuste os textos fixos (título, descrição, passo a passo e créditos).

O catálogo e o filtro por plataforma aparecem sozinhos.

## Publicar no GitHub Pages

1. Crie uma conta no GitHub e um repositório público, por exemplo `matrixoldgames-site`.
2. Envie todos os arquivos desta pasta para o repositório (botão **Add file → Upload files** funciona).
3. Em **Settings → Pages**, em *Source* escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Ainda em **Settings → Pages**, em *Custom domain* coloque `www.matrixoldgames.com.br` e salve.

### DNS no Registro.br

No painel do domínio, use os servidores DNS do próprio Registro.br e edite a zona com:

| Tipo  | Nome | Valor                      |
|-------|------|----------------------------|
| CNAME | www  | SEU-USUARIO.github.io      |
| A     | (vazio) | 185.199.108.153         |
| A     | (vazio) | 185.199.109.153         |
| A     | (vazio) | 185.199.110.153         |
| A     | (vazio) | 185.199.111.153         |

Troque `SEU-USUARIO` pelo seu usuário do GitHub. A propagação pode levar algumas horas.
Depois que o GitHub reconhecer o domínio, marque **Enforce HTTPS** em Settings → Pages.

## Onde hospedar os patches

Recomendado: **GitHub Releases** no mesmo repositório (ou num repositório só para patches).
Cada versão vira um release com o `.dcp` anexado, link permanente e sem limite de downloads.
O Google Drive pode continuar como espelho no campo `espelho`.

Nunca publique o GDI do jogo, só os patches.
