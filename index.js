const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000;

// Sua chave da API TMDB
const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 
const agent = new https.Agent({ rejectUnauthorized: false });

app.get('/', async (req, res) => {
    try {
        // Buscando os filmes populares
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
            params: { api_key: API_KEY, language: 'pt-BR' },
            httpsAgent: agent
        });
        const filmes = response.data.results;

        let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxFlix v1</title>
    <style>
        body { background: #111; color: white; font-family: sans-serif; margin: 0; text-align: center; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
        img { width: 100%; border-radius: 5px; cursor: pointer; }
        #player-container { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; z-index: 100; }
        iframe { width: 100%; height: calc(100% - 50px); border: none; }
        .back-btn { height: 50px; background: #e50914; color: white; line-height: 50px; cursor: pointer; font-weight: bold; }
    </style>
</head>
<body>
    <h1 style="color: #e50914;">MAXFLIX</h1>
    <div class="grid">
        ${filmes.map(f => `<img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="play('${f.id}')">`).join('')}
    </div>

    <div id="player-container">
        <div class="back-btn" onclick="fechar()">VOLTAR</div>
        <iframe id="video-iframe" allowfullscreen></iframe>
    </div>

    <script>
        function play(id) {
            const container = document.getElementById('player-container');
            const ifr = document.getElementById('video-iframe');
            // Este era o servidor que você gostou:
            ifr.src = "https://multiembed.eu/?video_id=" + id + "&tmdb=1";
            container.style.display = 'block';
        }
        function fechar() {
            document.getElementById('player-container').style.display = 'none';
            document.getElementById('video-iframe').src = '';
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.send("Erro ao carregar lista de filmes.");
    }
});

app.listen(port, '0.0.0.0', () => console.log("Servidor v1 Online"));
