const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000;

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
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxFlix v1</title>
    <style>
        body { background: #111; color: white; font-family: sans-serif; margin: 0; text-align: center; }
        header { background: #e50914; padding: 15px; font-weight: bold; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
        img { width: 100%; border-radius: 5px; cursor: pointer; border: 1px solid #333; }
        #player-container { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; z-index: 100; }
        iframe { width: 100%; height: calc(100% - 50px); border: none; }
        .back-btn { height: 50px; background: #333; color: white; line-height: 50px; cursor: pointer; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>
    <div class="grid">
        ${filmes.map(f => `<img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="play('${f.id}')">`).join('')}
    </div>

    <div id="player-container">
        <div class="back-btn" onclick="fechar()">✕ FECHAR E VOLTAR</div>
        <iframe id="video-iframe" src="" allowfullscreen sandbox="allow-forms allow-scripts allow-same-origin allow-presentation"></iframe>
    </div>

    <script>
        function play(id) {
            const container = document.getElementById('player-container');
            const ifr = document.getElementById('video-iframe');
            // Usando um link que tenta filtrar popups via sandbox no iframe
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
        res.send("Erro ao carregar lista.");
    }
});

app.listen(port, '0.0.0.0', () => console.log("Servidor Online"));
