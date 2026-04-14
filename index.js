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
    <title>MaxFlix Oficial</title>
    <style>
        body { background: #000; color: white; font-family: sans-serif; margin: 0; text-align: center; }
        header { background: #e50914; padding: 15px; font-weight: bold; font-size: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.8); }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
        img { width: 100%; border-radius: 5px; cursor: pointer; border: 1px solid #222; }
        #player-layer { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 100; }
        iframe { width: 100%; height: calc(100% - 60px); border: none; }
        .footer-controls { height: 60px; background: #111; display: flex; align-items: center; justify-content: center; border-top: 1px solid #333; }
        .btn-voltar { background: #e50914; color: white; border: none; padding: 12px 25px; border-radius: 4px; font-weight: bold; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>
    <div class="grid">
        ${filmes.map(f => `<img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="play('${f.id}')">`).join('')}
    </div>

    <div id="player-layer">
        <div class="footer-controls">
            <button class="btn-voltar" onclick="fechar()">✕ FECHAR VÍDEO</button>
        </div>
        <iframe id="ifr" src="" allowfullscreen></iframe>
    </div>

    <script>
        function play(id) {
            const layer = document.getElementById('player-layer');
            const ifr = document.getElementById('ifr');
            // Voltando para o servidor MultiEmbed (que você confirmou que pegava)
            ifr.src = "https://multiembed.eu/?video_id=" + id + "&tmdb=1";
            layer.style.display = 'block';
        }
        function fechar() {
            document.getElementById('player-layer').style.display = 'none';
            document.getElementById('ifr').src = '';
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) { res.send("Erro ao carregar filmes."); }
});

app.listen(port, '0.0.0.0', () => console.log("Sistema Pronto"));
