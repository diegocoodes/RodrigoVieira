# Mentoria Rodrigo Vieira

Landing page completa para **Do Zero a 50 Administrações**, com identidade em preto e dourado, fotos oficiais do mentor e conversão pelo WhatsApp.

A composição segue a referência mais recente: abertura centralizada com retrato acima do texto, apresentação do mentor em duas colunas, faixa horizontal e quatro cards de identificação lado a lado no desktop. As seções formam um fluxo contínuo, sem linhas verticais, molduras de página ou divisórias entre blocos. O acompanhamento de seis meses e a imersão de três dias aparecem em dois cards na mesma seção, com links próprios preservados. O programa mantém seis cards numerados e os nove assuntos originais, com detalhes por clique ou teclado. O próximo passo profissional usa três colunas e o FAQ tem respostas expansíveis em cards individuais. As grades se adaptam ao celular.

## Executar

Requer Node.js 24.x e npm. A versão está indicada em `.nvmrc`, `.node-version` e `package.json`.

```powershell
git clone https://github.com/diegocoodes/RodrigoVieira.git
cd RodrigoVieira
npm ci
npm run dev
```

Abra **http://127.0.0.1:3000**. O desenvolvimento usa Next.js com App Router, React, TypeScript e CSS com variáveis globais. A abertura utiliza Canvas 2D e os efeitos de iluminação usam CSS e SVG. A dependência `motion` permanece disponível para o componente reutilizável de abas preservado em `src/components/ui/21st/`. Não há UI kit global.

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
| Hostinger PHP/HTML | Executar `npm run build:hostinger` e extrair `dist/hostinger/rodrigo-vieira-hostinger.zip` em `public_html` |
| GitHub Actions | Cada push em `main` valida o build e disponibiliza o pacote Hostinger como artefato |

Antes da publicação definitiva, copie `.env.example` para `.env.local`, preencha `NEXT_PUBLIC_SITE_URL` com a origem HTTPS aprovada e gere novamente o build. Essa variável configura canonical, URLs de compartilhamento e sitemap. Sem domínio, a página utiliza a foto oficial remota no Open Graph e não inclui canonical nem endereços fictícios no sitemap.

## Alterar conteúdo

| Arquivo | Responsabilidade |
| --- | --- |
| `src/content/copy.ts` | Títulos, textos editoriais, legendas e CTAs |
| `src/content/mentorship.ts` | Programa, públicos, eixos, FAQ e depoimentos aprovados |
| `src/content/photos.ts` | Fotos selecionadas, dimensões e descrições acessíveis |
| `src/config/site.ts` | WhatsApp, mensagens, navegação e metadados |
| `src/styles/globals.css` | Tokens, composição, responsividade e movimento reduzido |
| `src/styles/motion.css` | Fundos animados, entradas, faixa contínua, interações e movimento reduzido |
| `src/styles/entry-and-program.css` | Abertura com vaporização e grade dos seis cards do programa |
| `src/styles/flow-layout.css` | Composição contínua, hero centralizado e seções adaptadas à última referência |
| `src/styles/vivid-motion.css` | Base preta, luzes e partículas douradas, faixa para a direita e animações dos títulos |
| `src/components/sections/` | Seções da landing page |
| `src/components/layout/` | Cabeçalho, rodapé e revelações durante a rolagem |
| `src/components/ui/` | Botões, títulos, ícones e ano dinâmico |
| `DEPLOY.md`, `vercel.json`, `deploy/` | Instruções e configurações das plataformas de hospedagem |
| `scripts/package-hostinger.mjs` | Geração do ZIP estático com `.htaccess` para a Hostinger |

O WhatsApp oficial é **558192017793**, confirmado no briefing e no site atual. Os CTAs de acompanhamento e imersão têm mensagens específicas. Os links abrem a conversa; nenhuma mensagem é enviada automaticamente.

## Imagens e fontes

As fotos exibidas foram selecionadas entre os arquivos enviados pelo cliente em `public/images`. O hero usa o retrato sorrindo com camisa marrom (`WhatsApp Image 2026-11-02 at 17.28.07 (2).jpeg`) e a apresentação usa o retrato sentado com terno cinza e a mão no queixo (`WhatsApp Image 2026-11-02 at 17.28.09 (2).jpeg`). Ambas mantêm as cores originais, sem filtros de preto e branco ou sépia. Os JPEGs originais estão preservados; a página carrega versões WebP locais de aproximadamente 63 KB e 69 KB. A imagem social local também foi atualizada com a foto do hero.

Os retratos do [site de referência do Rodrigo Vieira](https://gestconadmimoveis-cyber.github.io/mentoria-rodrigo-vieira/), utilizados na primeira versão conforme o briefing, também estão preservados.

Barlow Condensed e Manrope são servidas localmente em WOFF2. A Manrope variável oferece pesos reais de 400 a 800 e sustenta a leitura dos textos, títulos editoriais e controles. A Barlow Condensed mantém a identidade da marca e dos destaques condensados. Tamanhos fluidos, entrelinha e largura dos blocos organizam a hierarquia em cada viewport. Não há chamadas ao Google Fonts durante a navegação. As licenças SIL Open Font License estão incluídas em `public/fonts/`.

Não foram fornecidas fotografias aprovadas da operação Gestcon nem depoimentos. A imersão usa composição tipográfica e a seção de prova social permanece oculta. Para incluí-la, adicione somente relatos reais autorizados em `testimonials`.

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

Os títulos revelam palavras em sequência com entrada suave e desfoque, e os destaques recebem um degradê dourado. A implementação local `AnimatedWords.tsx` foi inspirada nos previews de Blur Out Up, Blur In Text e Text Reveal do catálogo 21st.dev. A consulta de uso confirmou que as duas recuperações gratuitas já estavam esgotadas: nenhum novo código pago foi recuperado e nenhuma assinatura foi iniciada. Os títulos do hero aguardam o encerramento da abertura; os demais animam uma vez ao entrar na tela. O texto continua legível sem JavaScript e com movimento reduzido, inclusive se a preferência mudar durante a navegação.

O cabeçalho mantém a identidade, os diferenciais e o menu compacto, sem botão de pausa. `prefers-reduced-motion` desativa as animações não essenciais automaticamente. Os efeitos combinam CSS, SVG, IntersectionObserver e Canvas 2D. As quatro seções principais permanecem visíveis na rolagem.

## Abertura com Rodrigo Vieira

O efeito `vapour-text-effect.tsx` foi integrado a partir do código enviado pelo cliente. A amostragem dos pixels do texto e a onda de partículas foram adaptadas para executar uma única vez com o nome **Rodrigo Vieira**, antes da página. A entrada normalmente dura cerca de três segundos, oferece “Entrar no site” e pode ser fechada com Escape. Movimento reduzido e links diretos para seções pulam a introdução. Sem JavaScript, a página continua acessível.

O componente está no caminho já adotado pelo projeto, `src/components/ui/`, acessível pelo alias `@/components/ui`. A implementação usa React, TypeScript e CSS local; não requer instalar Tailwind ou inicializar shadcn para executar esse efeito Canvas. O DPR é limitado e os frames, observers e listeners são encerrados ao concluir ou desmontar a animação.

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
- Todos os destinos internos e oito links de WhatsApp com mensagens codificadas.
- Quatro seções independentes visíveis nas nove larguras e acessíveis pelos links do hero, menu e rodapé.
- Carregamento das imagens e conteúdo principal disponível sem JavaScript.
- Auditoria axe de critérios WCAG A/AA em 390 e 1440 pixels, com relatório das violações automatizadas detectadas.
- Respeito a movimento reduzido e revelações durante a rolagem normal.
- Entrada com o nome Rodrigo Vieira, conclusão automática, encerramento com Escape e pelo botão de entrada, liberação da rolagem e mudança da preferência de movimento durante a animação.

Relatórios e capturas são gravados em `artifacts/`, ignorado pelo Git. A auditoria automatizada não substitui uma avaliação completa com tecnologias assistivas. A validação dos links confere destinos e mensagens; não envia conversas ao atendimento.

## Escopo de integrações

Não há formulário, rastreamento, pixel, promessa de resultado garantido ou contagem artificial de vagas. Analytics e imagens adicionais podem ser integrados quando houver dados e materiais aprovados.
