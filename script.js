document.getElementById('uploadForm').addEventListener('submit', function (event) {
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
        .then((response) => response.json())
        .then((data) => {
            statusDiv.textContent = data.message;
            console.log('Resposta do servidor:', data);
        })
        .catch((error) => {
            statusDiv.textContent = 'Falha no envio: ' + error.message;
            console.error('Erro:', error);
        });
});
