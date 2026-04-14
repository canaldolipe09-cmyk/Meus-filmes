const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000; // Ajustado para o Render

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
    <title>MaxFlix Cloud</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; text-align: center; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
        img { width: 100%; border-radius: 8px; cursor: pointer; border: 1px solid #222; }
        #player-layer { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 100; }
        iframe { width: 100%; height: calc(100% - 70px); border: none; }
        .controls { height: 70px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #111; }
        .btns { display: flex; gap: 5px; margin-top: 5px; }
        button { padding: 8px; cursor: pointer; background: #e50914; color: #fff; border: none; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <h2 style="color: red; margin: 10px 0;">MAXFLIX CLOUD</h2>
    <div class="grid">
        ${filmes.map(f => `<img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="abrirPlayer('${f.id}')">`).join('')}
    </div>
    <div id="player-layer">
        <div class="controls">
            <button onclick="fechar()" style="width: 90%;">VOLTAR À LISTA</button>
            <div class="btns">
                <button onclick="mudarServer(1)">Opção 1</button>
                <button onclick="mudarServer(2)">Opção 2</button>
                <button onclick="mudarServer(3)">Opção 3</button>
            </div>
        </div>
        <iframe id="main-ifr" allowfullscreen></iframe>
    </div>
    <script>
        let currentID = "";
        function abrirPlayer(id) {
            currentID = id;
            document.getElementById('player-layer').style.display = 'block';
            mudarServer(1); 
        }
        function mudarServer(num) {
            const ifr = document.getElementById('main-ifr');
            if(num === 1) ifr.src = "https://embed.warezcdn.net/movie/" + currentID;
            if(num === 2) ifr.src = "https://vidsrc.me/embed/movie?tmdb=" + currentID;
            if(num === 3) ifr.src = "https://multiembed.eu/?video_id=" + currentID + "&tmdb=1";
        }
        function fechar() {
            document.getElementById('player-layer').style.display = 'none';
            document.getElementById('main-ifr').src = '';
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) { res.send("Erro ao carregar lista."); }
});

app.listen(port, '0.0.0.0', () => console.log("Servidor Online!"));
