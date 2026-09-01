import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Set CORS headers to allow requests from anywhere
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle root path
    let filePath = req.url === '/' ? '/public/index.html' : req.url;

    // Construct full file path
    filePath = path.join(__dirname, filePath);

    // Prevent directory traversal
    const realPath = path.resolve(filePath);
    const publicPath = path.resolve(path.join(__dirname, 'public'));
    const srcPath = path.resolve(path.join(__dirname, 'src'));

    if (!realPath.startsWith(publicPath) && !realPath.startsWith(srcPath)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Not Found</h1>', 'utf-8');
        return;
    }

    // Read and serve the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Try to serve index.html for SPA routing
                if (req.url !== '/') {
                    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err2, content2) => {
                        if (err2) {
                            res.writeHead(404, { 'Content-Type': 'text/html' });
                            res.end('<h1>404 - Not Found</h1>', 'utf-8');
                        } else {
                            res.writeHead(200, { 'Content-Type': mimeTypes['.html'] });
                            res.end(content2, 'utf-8');
                        }
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 - Not Found</h1>', 'utf-8');
                }
            } else {
                res.writeHead(500);
                res.end('Server Error', 'utf-8');
            }
        } else {
            // Determine the content type
            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Ira AI Chat Server running at http://localhost:${PORT}`);
    console.log(`📖 Open http://localhost:${PORT} in your browser`);
    console.log(`⚙️  Press Ctrl+C to stop the server`);
});
