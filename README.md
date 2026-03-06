# ImperIA

Site oficial de apresentação do projeto **ImperIA**, pensado para ser publicado direto no GitHub Pages com domínio próprio.

## Sobre o jogo

ImperIA é um jogo de estratégia e simulação política em que cada campanha pode gerar um país diferente.

A proposta gira em torno de:

- aprovar, rejeitar ou negociar leis com consequências variáveis
- lidar com aprovação popular e pressão política
- atravessar três eras diferentes: idade média, tempos atuais e futuro cyberpunk
- responder a eventos dinâmicos como crises climáticas, guerras, colapsos econômicos e surtos de saúde
- conduzir o país até um final marcado por legado, colapso ou sobrevivência política

O jogo também trabalha com progressão entre eras, mudança visual do gabinete conforme a riqueza do país e um vice-presidente com personalidade própria, capaz de interferir no rumo da campanha.

## O que tem neste repositório

Este repositório contém a landing page pública do projeto.

Arquivos principais:

- `index.html`: estrutura completa da página
- `styles.css`: identidade visual, layout responsivo e animações
- `script.js`: animações de entrada, contadores e painel dinâmico do herói
- `assets/`: favicon e placeholders da equipe
- `CNAME`: domínio customizado do GitHub Pages
- `robots.txt` e `sitemap.xml`: base simples para indexação

## Estrutura de equipe na página

A seção "Sobre nós" já está pronta com os nomes e e-mails da equipe:

- Gabriel Lentini - `gabriel_lentini@playimperia.games`
- Vinícius Santanna - `santannavini@playimperia.games`
- Felipe Alves - `felipe@playimperia.games`

As imagens atuais são placeholders locais. Quando quiser trocar, basta substituir estes arquivos em `assets/team/` mantendo o mesmo nome, ou editar o `src` no `index.html`:

- `gabriel-lentini.svg`
- `vinicius-santanna.svg`
- `felipe-alves.svg`

## Como visualizar localmente

Como o site é estático, dá para abrir o `index.html` direto no navegador.

Se preferir rodar com servidor local, uma opção simples é:

```powershell
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Publicação no GitHub Pages

A página foi montada para funcionar sem build.

Passos esperados:

1. subir os arquivos para o repositório
2. ativar o GitHub Pages na branch principal
3. manter o `CNAME` com `playimperia.games`
4. garantir que o domínio esteja apontando para o Pages no provedor de DNS

## Contato

Contato principal do projeto: `contato@playimperia.games`
