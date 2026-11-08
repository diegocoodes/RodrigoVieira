import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve("out");
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    let file = resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    } catch {
      if (!extname(file)) file += ".html";
    }
    const { size } = await stat(file);
    const headers = {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Accept-Ranges": "bytes",
    };
    let start = 0;
    let end = size - 1;
    const range = request.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) {
        response.writeHead(416, { "Content-Range": `bytes */${size}` }).end();
        return;
      }
      start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
      end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start < 0 || start >= size) {
        response.writeHead(416, { "Content-Range": `bytes */${size}` }).end();
        return;
      }
      headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
    }
    headers["Content-Length"] = range ? end - start + 1 : size;
    response.writeHead(range ? 206 : 200, headers);
    if (request.method === "HEAD" || size === 0) {
      response.end();
      return;
    }
    await pipeline(createReadStream(file, { start, end }), response);
  } catch {
    if (!response.headersSent) response.writeHead(404).end("Not found");
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Local: http://127.0.0.1:${port}`),
);
