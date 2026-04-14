const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000;

// Chave da API do TMDB (Se parar de carregar a lista, me avisa)
const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 
const agent = new https.Agent({ rejectUnauthorized: false });

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
            params: { api_key: API_KEY, language: 'pt-BR' },
            httpsAgent: agent
        });
        const filmes = response.data.results;

        let html = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxFlix 2026</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; padding: 0; text-align: center; }
        header { background: #e50914; padding: 15px; font-size: 24px; font-weight: bold; position: sticky; top: 0; z-index: 100; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
        .movie img { width: 100%; border-radius: 8px; cursor: pointer; border: 1px solid #333; }
        #p-layer { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 200; }
        iframe { width: 100%; height: calc(100% - 60px); border: none; }
        .btn-voltar { height: 60px; background: #222; color: #fff; line-height: 60px; font-weight: bold; cursor: pointer; border-bottom: 2px solid #e50914; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>
    <div class="grid">
        ${filmes.map(f => `<div class="movie"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="play('${f.id}')"></div>`).join('')}
    </div>

    <div id="p-layer">
        <div class="btn-voltar" onclick="fechar()">✕ VOLTAR PARA A LISTA</div>
        <iframe id="video-ifr" src="" allowfullscreen></iframe>
    </div>

    <script>
        function play(id) {
            const layer = document.getElementById('p-layer');
            const ifr = document.getElementById('video-ifr');
            // Servidor vidsrc.to - O mais estável para evitar erros
            ifr.src = "https://vidsrc.to/embed/movie/" + id;
            layer.style.display = 'block';
        }
        function fechar() {
            document.getElementById('p-layer').style.display = 'none';
            document.getElementById('video-ifr').src = '';
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.status(500).send("Erro ao carregar a lista de filmes. Tente atualizar a página.");
    }
});

app.listen(port, '0.0.0.0', () => console.log("Servidor Online!"));
