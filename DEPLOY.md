# Publicar na Vercel e na Hostinger

O mesmo código atende às duas plataformas. O Next.js gera HTML, CSS, JavaScript, imagens e fontes em `out/`. O site não precisa de servidor Node.js depois do build.

## Análise de compatibilidade estática

O projeto usa Next.js 16.4.4 com App Router e já tem `output: "export"`, `trailingSlash: true` e `images.unoptimized: true` em `next.config.mjs`. Não é necessária uma conversão nem a remoção de funcionalidades.

| Recurso verificado | Resultado |
| --- | --- |
| API própria / Route Handlers de aplicação | Ausentes; `robots.ts` e `sitemap.ts` geram arquivos estáticos no build |
| SSR por requisição e ISR | Ausentes; os Server Components são executados apenas no build |
| Banco de dados e autenticação no servidor | Ausentes |
| Middleware, Proxy e Server Actions | Ausentes |
| Formulários e envio de dados | Não há formulários no projeto |
| WhatsApp | Oito links na página e um no modal; convite e parâmetros preservados |
| Vídeos, imagens e fontes | Arquivos locais em `public/`, copiados para `out/`; os espaços no caminho do vídeo estão codificados |
| Menu, modal, animações, programa e FAQ | Interações compatíveis com hospedagem estática |
| Meta Pixel | Integração no navegador, preservada, sem backend próprio |

A página principal é `/`; a navegação entre seções usa âncoras. Também são exportados `404.html`, `robots.txt`, `sitemap.xml` e `icon.svg`. Não há rotas dinâmicas que precisem de servidor nem redirecionamentos de Next.js a converter. Os botões do WhatsApp usam links diretos.

A única variável do site é `NEXT_PUBLIC_SITE_URL`. Sem ela, o site funciona, mas o canonical não é emitido, o sitemap fica sem URLs e o compartilhamento usa a imagem remota já prevista no código. Para completar esses metadados, configure a origem do domínio existente antes do build, conforme as instruções abaixo. O domínio, os links e o conteúdo não precisam ser alterados.

Publique **todo o conteúdo de `out/`**, incluindo `_next/`, `images/`, `videios/` e `fonts/`, na raiz do domínio existente. Não use `.next/` como pasta de publicação. O servidor de `npm run preview` é apenas uma ferramenta local de validação.

## Preparar o ambiente

Use **Node.js 24.x**, npm e o arquivo `package-lock.json` versionado:

```bash
git clone https://github.com/diegocoodes/RodrigoVieira.git
cd RodrigoVieira
npm ci
```

Se o domínio definitivo já estiver definido, copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SITE_URL` com a origem HTTPS do site, sem caminho. Essa variável é pública e configura canonical, sitemap e imagem de compartilhamento. Nunca coloque senhas ou chaves nesse arquivo de exemplo. Alterações de domínio exigem um novo build.

## Vercel: importar o repositório

1. Na Vercel, crie um projeto e importe `diegocoodes/RodrigoVieira`.
2. Use a branch `main` e **Root Directory `.`**, a raiz do repositório.
3. A configuração versionada em `vercel.json` usa os valores abaixo.
4. Adicione `NEXT_PUBLIC_SITE_URL` em Environment Variables quando conhecer o domínio final.
5. Clique em Deploy. Os próximos pushes em `main` serão processados pela integração Git da sua conta.

| Campo | Valor |
| --- | --- |
| Framework Preset | Other (exportação estática) |
| Node.js | 24.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `out` |

Não selecione `out` como Root Directory: ela é a saída gerada durante o build.

O preset **Other** é intencional e está definido por `"framework": null` em `vercel.json`. O código continua usando Next.js para gerar o site, mas a Vercel publica os arquivos estáticos de `out/`. Combinar o preset Next.js com essa saída pode provocar `NEXT_NO_ROUTES_MANIFEST`, pois o adaptador passa a procurar o manifesto interno dentro de `out/`. A configuração versionada tem prioridade sobre o preset do painel; ao configurar manualmente, use Other.

## Hostinger: publicação automática pelo GitHub

Para a integração com `diegocoodes/RodrigoVieira`, use a branch `main` e configure o aplicativo como **front-end estático** no hPanel:

| Campo | Valor |
| --- | --- |
| Framework / tipo | Other / front-end estático |
| Diretório raiz | `.` |
| Node.js | 24.x |
| Gerenciador de pacotes | npm |
| Comando de instalação, se disponível | `npm ci` |
| Comando de build | `npm run build` |
| Diretório de saída | `out` |
| Arquivo de entrada | Deixar vazio |
| Variável de ambiente | `NEXT_PUBLIC_SITE_URL=https://formuladalocacaorecorrente.com.br` |

Salve essas configurações e execute **Redeploy** com o commit mais recente da `main`. Os próximos pushes serão publicados pela integração GitHub da Hostinger.

O preset de servidor Next.js com saída `.next` não corresponde a este projeto: `output: "export"` gera o site pronto em `out/`. Se o painel atual não permitir publicar como front-end estático, crie um aplicativo front-end com a integração GitHub acima ou use o ZIP para hospedagem PHP/HTML descrito a seguir.

### Compatibilidade do compilador

O build usa `next build --webpack` para permitir o fallback WebAssembly do SWC em ambientes sem a GLIBC exigida pelo compilador nativo. A configuração fica em `next.config.mjs`, carregada diretamente pelo Node.js, sem transpilar um `next.config.ts`.

Isso trata a sequência de erros `GLIBC_2.29 not found`, `Failed to load next.config.ts` e `ERR_MODULE_NOT_FOUND` durante a leitura da configuração. O aviso sobre o binário nativo pode continuar aparecendo no servidor; confirme que o fallback WASM conclui o build. Não desative o fallback com `NEXT_DISABLE_SWC_WASM`.

## Hostinger: ZIP para hospedagem PHP/HTML

No computador, gere o pacote:

```bash
npm run build:hostinger
```

O arquivo pronto estará em **`dist/hostinger/rodrigo-vieira-hostinger.zip`**. Ele contém `index.html` diretamente na raiz, `_next/`, imagens, fontes, metadados e `.htaccess`. O empacotamento funciona em Windows, macOS e Linux, usando apenas Node.js.

1. No hPanel, adicione ou abra o site do tipo **PHP/HTML**.
2. No Gerenciador de Arquivos, abra o `public_html` do domínio correto.
3. Envie o ZIP e extraia seu conteúdo nessa pasta. Se o painel criar uma subpasta de extração, mova o conteúdo dela para `public_html`.
4. Confirme que existe **`public_html/index.html`** e que `_next/`, `images/`, `fonts/` e `.htaccess` estão ao lado dele.
5. Abra o domínio e confira as fotos, a animação de entrada, o FAQ e os links de WhatsApp.

Use a raiz de um domínio ou subdomínio. Publicar dentro de uma subpasta exige adaptar `basePath` e os caminhos dos assets. O Hostinger Website Builder tem um fluxo diferente; para este pacote, use hospedagem de arquivos PHP/HTML.

O ZIP não contém `node_modules`, código-fonte, credenciais ou arquivos `.env`. Não envie o ZIP do botão **Code → Download ZIP** do GitHub para `public_html`: ele contém o projeto-fonte, que precisa ser compilado primeiro.

### Baixar o pacote pelo GitHub

A aba **Actions** executa o workflow **Build e pacote Hostinger** a cada push em `main`. Depois do build aprovado, abra a execução e baixe o artefato `rodrigo-vieira-hostinger`. O download do GitHub contém o ZIP final de publicação; extraia esse download no computador para acessar `rodrigo-vieira-hostinger.zip`.

Para configurar o domínio desse build, crie a variável de repositório `NEXT_PUBLIC_SITE_URL` em **Settings → Secrets and variables → Actions → Variables** e execute novamente o workflow. Use uma variável comum; esse endereço não é segredo.

## Validar localmente

```bash
npm run build
npm run preview
```

Abra `http://127.0.0.1:3000`. Para gerar novamente o ZIP do build existente, use `npm run package:hostinger`.

No Windows, se o PowerShell bloquear `npm.ps1`, use `npm.cmd install`, `npm.cmd run build` e `npm.cmd run preview`. Isso executa os mesmos comandos sem alterar a política de execução do sistema.

### Resultado da validação em 16/11/2026

- `npm install` concluído com Node.js 24.19.0, sem vulnerabilidades reportadas pelo npm.
- `npm run build` concluído, incluindo a checagem TypeScript; todas as rotas foram classificadas como estáticas.
- Os 35 arquivos de `public/` foram comparados com a exportação por SHA-256, sem diferenças.
- `npm run qa` aprovado no Microsoft Edge, servindo apenas `out/` na porta local 4317: nove larguras de tela, âncoras, oito links de WhatsApp da página e o link do modal, menus, programa, FAQ, reprodução e busca dos dois vídeos, animações, modo sem JavaScript e Meta Pixel. As auditorias automatizadas de acessibilidade em 390 e 1440 pixels não detectaram violações. O relatório fica em `artifacts/qa-results.json`.
- `npm run package:hostinger` gerou `dist/hostinger/rodrigo-vieira-hostinger.zip`; os 77 arquivos do ZIP foram conferidos com a exportação e o `.htaccess` de origem.

Não foi encontrado impedimento técnico para hospedagem estática. O build validado não recebeu `NEXT_PUBLIC_SITE_URL`; permanece a pendência opcional dos metadados descrita acima. Nenhum arquivo-fonte foi removido e nenhum domínio foi alterado. As alterações versionadas desta preparação se limitam a este guia e aos comentários de `.env.example`; a configuração de exportação já estava correta.

## Referências oficiais

- [Next.js: exportação estática](https://nextjs.org/docs/app/guides/static-exports)
- [Vercel: configuração de build](https://vercel.com/docs/builds/configure-a-build)
- [Vercel: versões do Node.js](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Hostinger: upload de arquivos e extração em public_html](https://www.hostinger.com/support/1869114-how-to-upload-backups-with-file-manager-in-hostinger/)
- [Hostinger: publicação de aplicativos pelo GitHub](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
- [Hostinger: compatibilidade do Next.js 16 e GLIBC](https://www.hostinger.com/support/how-to-fix-next-js-16-turbopack-build-errors-on-hostinger/)
- [Next.js: opções do build com Webpack](https://nextjs.org/docs/app/api-reference/cli/next#next-build-options)
- [Next.js: configuração JavaScript com módulos ESM](https://nextjs.org/docs/app/api-reference/config/next-config-js#ecmascript-modules)
