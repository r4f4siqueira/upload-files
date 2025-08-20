const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const port = 3000;
const uploadDir = path.join(__dirname, 'uploads');

// Certifica que o diretório de uploads existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const server = http.createServer((req, res) => {
    // Rota para servir a página HTML
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Upload de Arquivo (Sem Dependências)</title>
                <style>
                    body {
                        font-family: sans-serif;
                        padding: 20px;
                        background-color: #f0f0f0;
                        color: #333;
                    }

                    h1 {
                        color: #0056b3;
                    }

                    form {
                        margin-top: 20px;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }

                    input[type='file'] {
                        margin: 16px;
                    }

                    button {
                        margin: 16px;
                        padding: 10px 15px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        width: 200px;
                    }

                    button:hover {
                        background-color: #0056b3;
                    }

                    #status {
                        color: green;
                        margin-top: 15px;
                        padding: 10px;
                        border: 1px solid #ccc;
                        background-color: #e9ecef;
                        border-radius: 5px;
                    }


                </style>
            </head>
            <body>
                <h1>Upload de Arquivo</h1>
                <p>Selecione o arquivo que deseja enviar para o computador, só pode enviar <b>UM ARQUIVO</b> por vêz !</p>
                <form id="uploadForm" enctype="multipart/form-data">
                    <label for="fileInput">Selecione um arquivo</label>
                    <input type="file" id="fileInput" name="arquivo">
                    <button type="submit">Enviar Arquivo</button>
                </form>
                <div id="status"></div>

                <script>
                    document.getElementById('uploadForm').addEventListener('submit', function(event) {
                        event.preventDefault();
                        const fileInput = document.getElementById('fileInput');
                        const file = fileInput.files[0];
                        const statusDiv = document.getElementById('status');
                        
                        if (!file) {
                            statusDiv.textContent = 'Por favor, selecione um arquivo.';
                            return;
                        }

                        const formData = new FormData();
                        formData.append('arquivo', file);

                        statusDiv.textContent = 'Enviando...';

                        fetch('/', {
                            method: 'POST',
                            body: formData,
                        })
                        .then(response => response.json())
                        .then(data => {
                            statusDiv.textContent = data.message;
                            console.log('Resposta do servidor:', data);
                        })
                        .catch(error => {
                            statusDiv.textContent = 'Falha no envio: ' + error.message;
                            console.error('Erro:', error);
                        });
                    });
                </script>
            </body>
            </html>
        `);
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

            // Encontrar o início do arquivo no buffer
            const fileStart = buffer.indexOf('filename="') + 10;
            const fileEnd = buffer.indexOf('"\r\n', fileStart);
            // Fazendo isso para não sobscrever arquivos enviados com o mesmo nome em datas diferentes
            const dateString = new Date()
                .toLocaleString('pt-br', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                })
                .replace(/[/]/g, '-');
            const filename = `${dateString} ${buffer.toString('utf-8', fileStart, fileEnd)}`;

            // Encontrar o início dos dados binários do arquivo
            const dataStart = buffer.indexOf('\r\n\r\n') + 4;
            const dataEnd = buffer.lastIndexOf(`--${boundary}--`) - 2;

            const fileData = buffer.slice(dataStart, dataEnd);

            // Salvar o arquivo no disco
            const filePath = path.join(uploadDir, filename);
            fs.writeFile(filePath, fileData, (err) => {
                if (err) {
                    console.error('Erro ao salvar o arquivo:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Erro ao salvar o arquivo no servidor.' }));
                    return;
                }

                console.log(`Arquivo salvo em: ${uploadDir}/${filename}`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `O arquivo "${filename}" foi salvo com sucesso!` }));
            });
        });
    } else {
        // Rota de erro 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Página não encontrada.');
    }
});

// Pega o IPvA do Servidor para mostrar no console
function getIPv4() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const addresses = interfaces[interfaceName];
        for (const address of addresses) {
            if (address.family === 'IPv4' && !address.internal) {
                return address.address;
            }
        }
    }
    return null; // Retorna null se nenhum endereço IPv4 válido for encontrado
}

server.listen(port, () => {
    console.table({
        'Link para acessar Upload-Files': `http://${getIPv4()}:${port}` || 'Não encontrado',
        'Arquivos será salvo em': uploadDir,
        Porta: port,
        'Versão do node': process.version,
        'Mais informações': 'https://github.com/r4f4siqueira/upload-files',
    });
});
