const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const uploadDir = path.join(__dirname, 'uploads');

// Certifica que o diretório de uploads existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const server = http.createServer((req, res) => {
    // Rota para servir os arquivos estáticos
    if (req.method === 'GET') {
        let filePath = '.' + req.url;
        if (filePath === './') {
            filePath = './index.html';
        }

        const extname = path.extname(filePath);
        let contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
        }

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code == 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>Página não encontrada</h1>');
                } else {
                    res.writeHead(500);
                    res.end('Desculpe, erro interno no servidor: ' + error.code);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }

    // Rota para o upload do arquivo
    else if (req.method === 'POST' && req.url === '/') {
        let body = [];
        const boundary = req.headers['content-type'].split('boundary=')[1];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const buffer = Buffer.concat(body);

            const fileStart = buffer.indexOf('filename="') + 10;
            const fileEnd = buffer.indexOf('"\r\n', fileStart);
            const filename = buffer.toString('utf-8', fileStart, fileEnd);

            const dataStart = buffer.indexOf('\r\n\r\n') + 4;
            const dataEnd = buffer.lastIndexOf(`--${boundary}--`) - 2;

            const fileData = buffer.slice(dataStart, dataEnd);

            const filePath = path.join(uploadDir, filename);
            fs.writeFile(filePath, fileData, (err) => {
                if (err) {
                    console.error('Erro ao salvar o arquivo:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Erro ao salvar o arquivo no servidor.' }));
                    return;
                }

                console.log(`Arquivo salvo: ${filename}`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `O arquivo "${filename}" foi salvo com sucesso!` }));
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Página não encontrada.');
    }
});

server.listen(port, () => {
    console.log(`Servidor rodando em http://127.0.0.1:${port}`);
});
