const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000;

// Substitua pela sua chave do TMDB se esta não funcionar
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
    <title>MaxFlix Pro</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; padding: 0; }
        header { background: #e50914; padding: 15px; font-weight: bold; font-size: 24px; position: sticky; top: 0; z-index: 10; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; padding: 15px; }
        .movie-card img { width: 100%; border-radius: 5px; cursor: pointer; transition: 0.3s; border: 2px solid transparent; }
        .movie-card img:hover { transform: scale(1.05); border-color: #fff; }
        
        #player-layer { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 100; }
        .controls { height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #111; border-bottom: 2px solid #e50914; }
        .btns { display: flex; gap: 10px; margin-top: 10px; }
        button { padding: 8px 15px; cursor: pointer; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; font-size: 14px; }
        button.active { background: #e50914; border-color: #fff; }
        button.close { background: #555; width: 90%; font-weight: bold; }
        
        iframe { width: 100%; height: calc(100% - 80px); border: none; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>
    <div class="grid">
        ${filmes.map(f => `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="abrirPlayer('${f.id}')">
            </div>
        `).join('')}
    </div>

    <div id="player-layer">
        <div class="controls">
            <button class="close" onclick="fechar()">✕ VOLTAR PARA A LISTA</button>
            <div class="btns">
                <button id="btn1" onclick="mudarServer(1)">Opção 1</button>
                <button id="btn2" onclick="mudarServer(2)">Opção 2</button>
                <button id="btn3" onclick="mudarServer(3)">Opção 3</button>
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
            
            // Reset botões
            document.querySelectorAll('.btns button').forEach(b => b.classList.remove('active'));
            document.getElementById('btn' + num).classList.add('active');

            // Novos servidores que funcionam melhor no Render
            if(num === 1) ifr.src = "https://vidsrc.to/embed/movie/" + currentID;
            if(num === 2) ifr.src = "https://multiembed.eu/?video_id=" + currentID + "&tmdb=1";
            if(num === 3) ifr.src = "https://embed.smashystream.com/playere.php?tmdb=" + currentID;
        }

        function fechar() {
            document.getElementById('player-layer').style.display = 'none';
            document.getElementById('main-ifr').src = '';
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.status(500).send("Erro ao carregar filmes. Verifique sua chave da API.");
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`);
});
