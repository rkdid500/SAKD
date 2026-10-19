// Local server for the 리디자인_인터넷 copy of https://sakd.co.kr/internet
//   node serve.mjs [port]      (default 8935)
// Serves the mirrored Vite build, falls back to index.html for SPA routes,
// and answers /api/* from mock-api/ so nothing is sent to the real site.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.argv[2]) || 8935;
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon',
};
const readMock = (name) => JSON.parse(fs.readFileSync(path.join(root, 'mock-api', name), 'utf8'));
const sendJson = (res, body, status = 200) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
};

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  // Patched asset URLs carry the GitHub Pages prefix; strip it so local serving works too.
  const pagesBase = '/SAKD/리디자인_인터넷';
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.startsWith(pagesBase)) pathname = pathname.slice(pagesBase.length) || '/';

  if (pathname.startsWith('/api/')) {
    if (req.method !== 'GET') { res.writeHead(204); return res.end(); }
    if (pathname === '/api/internet-products') return sendJson(res, readMock('internet-products.json'));
    if (pathname === '/api/reviews') {
      const data = readMock('reviews.json');
      const limit = Number(url.searchParams.get('limit')) || data.items.length;
      const offset = Number(url.searchParams.get('offset')) || 0;
      return sendJson(res, { ...data, items: data.items.slice(offset, offset + limit) });
    }
    if (pathname === '/api/home-banners') return sendJson(res, { configured: false, banners: [] });
    if (pathname === '/api/csrf') return sendJson(res, { ok: true });
    if (pathname === '/api/members/session') return sendJson(res, { authenticated: false, member: null });
    return sendJson(res, { message: 'mock: not available' }, 404);
  }

  let file = path.join(root, pathname);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
  res.writeHead(200, { 'content-type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`리디자인_인터넷 → http://localhost:${port}/internet`));
