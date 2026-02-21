const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.env.PORT || process.env.npm_config_port || 4173);
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

function safeJoin(base, target) {
  const normalized = path.posix.normalize(`/${target}`).replace(/^\/+/, '');
  return path.join(base, normalized);
}

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, 'Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, MIME[ext] || 'application/octet-stream');
  });
}

http
  .createServer((req, res) => {
    const rawPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const pathname = rawPath === '/' ? '/index.html' : rawPath;
    const filePath = safeJoin(root, pathname);

    if (!filePath.startsWith(root)) {
      send(res, 403, 'Forbidden');
      return;
    }

    fs.stat(filePath, (err, stat) => {
      if (!err && stat.isFile()) {
        sendFile(res, filePath);
        return;
      }

      // Preview fallback: always show app shell instead of Not Found.
      sendFile(res, path.join(root, 'index.html'));
    });
  })
  .listen(port, '0.0.0.0', () => {
    console.log(`Preview server running on http://0.0.0.0:${port}`);
  });
