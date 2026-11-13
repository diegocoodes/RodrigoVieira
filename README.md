# Mentoria Rodrigo Vieira

Landing page completa para **Do Zero a 50 Administrações**, com identidade em preto e dourado, fotos oficiais do mentor e conversão pelo WhatsApp.

A abertura mantém o retrato de Rodrigo acima do texto, como no hero original. Ao abrir o site, o vídeo de Rodrigo em Portugal aparece diretamente em um modal com borda dourada animada, sem controles de vídeo, com X para fechar e o botão “Entrar na mentoria” abaixo. A animação de entrada em partículas foi removida. O segundo vídeo permanece logo abaixo de “Essa mentoria foi feita para você que”. A seção “Antes de crescer, estruture.” apresenta o título à esquerda e os dois parágrafos à direita, em um painel separado; no celular, os blocos ficam empilhados. A apresentação do mentor, o programa, o acompanhamento, a imersão e os feedbacks preservam seus conteúdos.

## Executar

Requer Node.js 24.x e npm. A versão está indicada em `.nvmrc`, `.node-version` e `package.json`.

```powershell
git clone https://github.com/diegocoodes/RodrigoVieira.git
cd RodrigoVieira
npm ci
npm run dev
```

Abra **http://127.0.0.1:3000**. O desenvolvimento usa Next.js com App Router, React, TypeScript e CSS com variáveis globais. Os efeitos de iluminação usam CSS e SVG. A dependência `motion` permanece disponível para o componente reutilizável de abas preservado em `src/components/ui/21st/`. Não há UI kit global.

## Build e publicação

```powershell
npm run build
npm run preview
```

A pasta `out/` contém a exportação estática pronta para hospedagem. Não depende de servidor Node em produção. Sirva os arquivos com um servidor HTTP; abrir `index.html` diretamente pelo sistema de arquivos não resolve as rotas dos assets.

O repositório está preparado para Vercel e Hostinger. O passo a passo está em **[DEPLOY.md](DEPLOY.md)**.

| Destino | Como publicar |
| --- | --- |
| Vercel | Importar com Root Directory `.` e preset Other; `vercel.json` configura o build estático e a saída `out` |
| Hostinger GitHub | Aplicativo front-end estático / Other, Node.js 24.x, build `npm run build`, saída `out` e sem arquivo de entrada; detalhes em `DEPLOY.md` |
| Hostinger PHP/HTML | Executar `npm run build:hostinger` e extrair `dist/hostinger/rodrigo-vieira-hostinger.zip` em `public_html` |
| GitHub Actions | Cada push em `main` valida o build e disponibiliza o pacote Hostinger como artefato |

Antes da publicação definitiva, copie `.env.example` para `.env.local`, preencha `NEXT_PUBLIC_SITE_URL` com a origem HTTPS aprovada e gere novamente o build. Essa variável configura canonical, URLs de compartilhamento e sitemap. Sem domínio, a página utiliza a foto oficial remota no Open Graph e não inclui canonical nem endereços fictícios no sitemap.

## Alterar conteúdo

| Arquivo | Responsabilidade |
| --- | --- |
| `src/content/copy.ts` | Títulos, textos editoriais, legendas e CTAs |
| `src/content/mentorship.ts` | Programa, públicos, eixos, FAQ e exemplos fictícios de feedback |
| `src/content/photos.ts` | Fotos selecionadas, dimensões e descrições acessíveis |
| `src/content/videos.ts` | Arquivos dos vídeos, capas e legendas descritivas |
| `src/config/site.ts` | Grupo do WhatsApp, navegação e metadados |
| `src/styles/globals.css` | Tokens, composição, responsividade e movimento reduzido |
| `src/styles/motion.css` | Fundos animados, entradas, faixa contínua, interações e movimento reduzido |
| `src/styles/entry-and-program.css` | Grade dos seis cards do programa |
| `src/styles/flow-layout.css` | Composição contínua, hero centralizado e seções adaptadas à última referência |
| `src/styles/vivid-motion.css` | Base preta, luzes e partículas douradas, faixa para a direita e animações dos títulos |
| `src/styles/media-and-feedback.css` | Modal de vídeo, proposta em duas colunas, borda animada e cards de feedback |
| `src/components/sections/` | Seções da landing page |
| `src/components/layout/` | Cabeçalho, rodapé e revelações durante a rolagem |
| `src/components/ui/` | Botões, títulos, ícones e ano dinâmico |
| `DEPLOY.md`, `vercel.json`, `deploy/` | Instruções e configurações das plataformas de hospedagem |
| `scripts/package-hostinger.mjs` | Geração do ZIP estático com `.htaccess` para a Hostinger |

Os oito links de WhatsApp da página e o botão do modal usam o [grupo informado pelo cliente](https://chat.whatsapp.com/LmII1YduewFGVAvKpfpuU3?s=cl&p=a&iam=2), centralizado em `site.whatsappGroupUrl`. Os links preservam os parâmetros do convite e abrem em nova aba. Acionar o botão do modal também fecha o vídeo e interrompe a reprodução.

## Imagens e fontes

As fotos foram selecionadas entre os arquivos enviados pelo cliente em `public/images`. A apresentação do mentor usa o retrato sentado com terno cinza e a mão no queixo (`WhatsApp Image 2026-11-02 at 17.28.09 (2).jpeg`), em WebP local. O hero usa novamente a foto sorrindo com camisa marrom, também preservada na imagem social. As três imagens dos feedbacks (`anitlacorretora`, `augustosimoes` e `janamartinez`) possuem versões WebP de 160 × 160 pixels para os avatares, com os PNGs originais preservados.

Os vídeos originais estão em `public/videios/`: `rodrigo portugal2.mp4` no modal de boas-vindas e `PORTUGAL_V04_lisboa-e-madri_125.mp4` na seção de identificação. Ambos mantêm a proporção 9:16 e `preload="none"`. O modal aguarda o clique em “Assistir com som” para reproduzir o vídeo com áudio, sem controles nativos. O botão de play reaparece ao pausar ou terminar; X e Escape fecham o modal e interrompem a reprodução. O vídeo da seção mantém controles nativos, iniciando por interação. As capas WebP foram extraídas dos próprios vídeos. O servidor de preview entrega `video/mp4` e aceita intervalos de bytes. A borda do modal respeita `prefers-reduced-motion`.

Os retratos do [site de referência do Rodrigo Vieira](https://gestconadmimoveis-cyber.github.io/mentoria-rodrigo-vieira/), utilizados na primeira versão conforme o briefing, também estão preservados.

Barlow Condensed e Manrope são servidas localmente em WOFF2. A Manrope variável oferece pesos reais de 400 a 800 e sustenta a leitura dos textos, títulos editoriais e controles. A Barlow Condensed mantém a identidade da marca e dos destaques condensados. Tamanhos fluidos, entrelinha e largura dos blocos organizam a hierarquia em cada viewport. Não há chamadas ao Google Fonts durante a navegação. As licenças SIL Open Font License estão incluídas em `public/fonts/`.

A seção de feedbacks usa textos fictícios solicitados para ilustrar o layout, com aviso visível na seção e em cada card. Eles não representam falas reais das pessoas retratadas. Os textos estão em `testimonials` e os avisos em `copy.proof`. Ao substituir por relatos reais, use conteúdo autorizado e atualize a identificação conforme a origem dos depoimentos.

## Movimento e componentes do 21st.dev

Foram selecionados dois componentes do 21st.dev para concentrar os aprimoramentos na iluminação e na navegação do programa:

| Componente | Autoria e origem | Adaptação no projeto |
| --- | --- | --- |
| Spotlight | [manuarora700](https://21st.dev/@manuarora700/components/spotlight), demo `989` | Iluminação dourada adaptada ao CSS local, preservando as cores das fotos, o contraste e a preferência por movimento reduzido |
| Animated Tabs | [educalvolpz](https://21st.dev/@educalvolpz/components/animated-tabs), demo `24930` | Componente reutilizável preservado; a seção do programa agora usa os seis cards da nova referência |

Nesta atualização foram feitas **exatamente duas consultas de código incluídas na cota gratuita**. O retorno da segunda confirmou **0 de 2 consultas restantes**. As buscas no catálogo foram gratuitas. As atribuições e adaptações estão registradas em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), sem presumir uma licença específica para os componentes.

- Iluminação dourada com deslocamento lento no hero e no fundo da página.
- Revelação das linhas do título em sequência e entrada suave do retrato.
- Cards com entradas escalonadas e feedback de borda e posição no hover.
- Faixa contínua com repetição sem salto e pausa ao passar o mouse.
- Botões com passagem de luz no hover e resposta visual das setas.
- Abertura e fechamento suave do FAQ nos navegadores que suportam `::details-content`, com funcionamento nativo nos demais.

A faixa apresenta 12 temas reais da mentoria e se desloca continuamente para a direita. A repetição usa dois grupos iguais, com o segundo oculto para leitores de tela. O fundo tem base preta sólida, luzes douradas localizadas nas bordas e pequenas partículas douradas, animadas por transformações e opacidade. Os cards usam cinza neutro, mantendo o dourado nos destaques e na iluminação, sem reconstruir as linhas removidas do layout. O Spotlight do 21st.dev também ilumina a seção de acompanhamento e imersão.

Os títulos revelam palavras em sequência com entrada suave e desfoque, e os destaques recebem um degradê dourado. A implementação local `AnimatedWords.tsx` foi inspirada nos previews de Blur Out Up, Blur In Text e Text Reveal do catálogo 21st.dev. A consulta de uso confirmou que as duas recuperações gratuitas já estavam esgotadas: nenhum novo código pago foi recuperado e nenhuma assinatura foi iniciada. Os títulos do hero aguardam o fechamento do vídeo de boas-vindas; os demais animam uma vez ao entrar na tela. O texto continua legível sem JavaScript e com movimento reduzido, inclusive se a preferência mudar durante a navegação.

O cabeçalho mantém a identidade, os diferenciais e o menu compacto, sem botão de pausa. `prefers-reduced-motion` desativa as animações não essenciais automaticamente. Os efeitos combinam CSS, SVG e IntersectionObserver. As quatro seções principais permanecem visíveis na rolagem.

## Entrada no site

A animação com o nome Rodrigo Vieira e o efeito Canvas de partículas foram removidos. `SiteEntry` abre diretamente o modal de vídeo de boas-vindas, que aguarda o clique em “Assistir com som”. X, Escape e o CTA fecham o modal, interrompem a reprodução e liberam a rolagem. O foco volta ao CTA do hero. Links diretos para seções pulam o modal. Sem JavaScript, a página permanece acessível sem sobreposições.

A pesquisa utilizou referências primárias de [animação de texto do Motion](https://motion.dev/docs/text-animation), [animações eficientes em CSS no web.dev](https://web.dev/articles/animations-guide), [tipografia responsiva no web.dev](https://web.dev/learn/design/typography), [accordions nativos na MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content) e [controle de movimento no W3C](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). A implementação mantém a direção visual em preto e dourado e as cores originais das fotos.

## Verificação

```powershell
npm run typecheck
npm run qa
npm run qa:visual
```

O QA usa o build exportado e requer `npm run preview` em outro terminal. Por padrão usa Microsoft Edge instalado. É possível definir `QA_BROWSER=chrome` para usar Chrome. `qa:visual` verifica as revelações com movimento normal, registra métricas locais e captura o hero e o painel do mentor.

O QA cobre:

- Build de produção e tipos TypeScript.
- Ausência de overflow em 320, 360, 390, 700, 768, 900, 1024, 1440 e 1920 pixels.
- Seis cards do programa por mouse e teclado, com os nove assuntos originais preservados.
- Seis accordions do FAQ por mouse e teclado.
- Menu mobile, fechamento com Escape, restauração de foco e navegação.
- Todos os destinos internos, os oito links da página e o botão do modal com o convite exato do grupo do WhatsApp.
- Modal direto, sem animação de entrada, espera pelo play, reprodução com som e áudio decodificado, X e Escape, foco contido, pausa ao fechar e CTA abaixo do vídeo.
- Hero original com retrato, proposta em duas colunas no desktop e empilhada no celular, com os textos preservados.
- Vídeo PORTUGAL_V04 abaixo do título de identificação, reprodução, busca e entrega parcial dos arquivos.
- Três cards de feedback com fotos e identificação explícita como exemplos fictícios.
- Quatro seções independentes visíveis nas nove larguras e acessíveis pelos links do hero, menu e rodapé.
- Carregamento das imagens e conteúdo principal disponível sem JavaScript.
- Auditoria axe de critérios WCAG A/AA em 390 e 1440 pixels, com relatório das violações automatizadas detectadas.
- Respeito a movimento reduzido e revelações durante a rolagem normal.
- Ausência da abertura em partículas, modal direto, liberação da rolagem e mudança da preferência de movimento.
- Meta Pixel com uma inicialização e um evento `PageView` por carregamento, além da alternativa sem JavaScript. As chamadas à Meta são interceptadas durante o QA para não registrar visitas de teste.

Relatórios e capturas são gravados em `artifacts/`, ignorado pelo Git. A auditoria automatizada não substitui uma avaliação completa com tecnologias assistivas. A validação dos links confere o convite do grupo; não participa do grupo nem envia mensagens.

## Escopo de integrações

O Meta Pixel **1615223779888343** está instalado no layout global (`src/app/layout.tsx`) com `next/script` e estratégia `afterInteractive`. O código inicializa o Pixel e envia `PageView` uma vez por carregamento da página. A imagem de rastreamento em `noscript` atende navegadores sem JavaScript. Não há formulário, promessa de resultado garantido ou contagem artificial de vagas.
