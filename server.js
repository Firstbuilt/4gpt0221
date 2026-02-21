const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.env.PORT || 8000);
const root = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function safeResolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^([.][.][/\\])+/, '');
  return path.join(root, normalized);
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = req.url || '/';
  const requested = safeResolve(urlPath === '/' ? '/index.html' : urlPath);

  if (!requested.startsWith(root)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(requested, (err, stat) => {
    if (!err && stat.isFile()) {
      sendFile(res, requested);
      return;
    }

    // SPA / preview fallback: unknown path always returns index.html
    sendFile(res, path.join(root, 'index.html'));
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Preview server running on http://0.0.0.0:${port}`);
});
