// One-off patch: make the mirrored build work under https://rkdid500.github.io/SAKD/리디자인_인터넷/
import fs from 'node:fs';
import path from 'node:path';
const B = '/SAKD/%EB%A6%AC%EB%94%94%EC%9E%90%EC%9D%B8_%EC%9D%B8%ED%84%B0%EB%84%B7';
const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const decode = (p) => decodeURIComponent(p);
const rootDir = decode(root);
const files = [...fs.readdirSync(path.join(rootDir, 'assets')).filter(f => /\.(js|css)$/.test(f)).map(f => path.join(rootDir, 'assets', f)), path.join(rootDir, 'index.html')];
let n = 0;
for (const f of files) {
  let t = fs.readFileSync(f, 'utf8'); const o = t;
  t = t.replace(/([`"'(])\/(assets\/|internet-carriers\/|favicon\.png|ssakdeal-link-preview)/g, (m, a, b) => `${a}${B}/${b}`);
  if (f.endsWith('index-RCINtR6H.js')) t = t.replace('(e){return`/`+e}', `(e){return\`${B}/\`+e}`);
  if (t !== o) { fs.writeFileSync(f, t); n++; }
}
console.log('patched', n, 'files');
