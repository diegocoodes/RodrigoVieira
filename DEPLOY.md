# Publicar na Vercel e na Hostinger

O mesmo código atende às duas plataformas. O Next.js gera HTML, CSS, JavaScript, imagens e fontes em `out/`. O site não precisa de servidor Node.js depois do build.

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

## Referências oficiais

- [Next.js: exportação estática](https://nextjs.org/docs/app/guides/static-exports)
- [Vercel: configuração de build](https://vercel.com/docs/builds/configure-a-build)
- [Vercel: versões do Node.js](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Hostinger: upload de arquivos e extração em public_html](https://www.hostinger.com/support/1869114-how-to-upload-backups-with-file-manager-in-hostinger/)
