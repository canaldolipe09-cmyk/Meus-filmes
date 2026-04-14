const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 

app.get('/', async (req, res) => {
    try {
        const [filmes, series, animes] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`),
            axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR`),
            axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=16`)
        ]);

        let html = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxFlix Oficial</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; padding-bottom: 50px; }
        header { background: #e50914; padding: 15px; font-weight: bold; font-size: 22px; position: sticky; top: 0; z-index: 100; text-align: center; }
        h2 { margin: 20px 0 10px 15px; color: #fff; font-size: 18px; }
        .row { display: flex; overflow-x: auto; gap: 10px; padding: 0 15px; scrollbar-width: none; }
        .row::-webkit-scrollbar { display: none; }
        .card { min-width: 120px; cursor: pointer; transition: 0.3s; }
        .card img { width: 100%; border-radius: 8px; border: 1px solid #333; }
        .card:active { transform: scale(0.9); }
        
        #player-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 1000; }
        .nav-player { height: 60px; background: #111; display: flex; align-items: center; padding: 0 15px; border-bottom: 2px solid #e50914; }
        .btn-fechar { background: #e50914; color: #fff; border: none; padding: 10px 15px; border-radius: 5px; font-weight: bold; cursor: pointer; }
        iframe { width: 100%; height: calc(100% - 60px); border: none; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>

    <h2>🎬 Filmes</h2>
    <div class="row">
        ${filmes.data.results.map(f => `<div class="card" onclick="abrirPlayer('movie', '${f.id}')"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}"></div>`).join('')}
    </div>

    <h2>📺 Séries</h2>
    <div class="row">
        ${series.data.results.map(s => `<div class="card" onclick="abrirPlayer('tv', '${s.id}')"><img src="https://image.tmdb.org/t/p/w300${s.poster_path}"></div>`).join('')}
    </div>

    <h2>🎌 Animes</h2>
    <div class="row">
        ${animes.data.results.map(a => `<div class="card" onclick="abrirPlayer('tv', '${a.id}')"><img src="https://image.tmdb.org/t/p/w300${a.poster_path}"></div>`).join('')}
    </div>

    <div id="player-modal">
        <div class="nav-player">
            <button class="btn-fechar" onclick="fecharPlayer()">✕ VOLTAR</button>
            <span style="margin-left: 15px; font-size: 12px; color: #ffca28;">Use o ícone '☰' no vídeo para trocar episódios!</span>
        </div>
        <iframe id="video-iframe" allowfullscreen></iframe>
    </div>

    <script>
        function abrirPlayer(tipo, id) {
            const modal = document.getElementById('player-modal');
            const frame = document.getElementById('video-iframe');
            
            // Link do novo servidor Vidsrc.to (Mais rápido e com episódios)
            frame.src = "https://vidsrc.to/embed/" + tipo + "/" + id;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function fecharPlayer() {
            const modal = document.getElementById('player-modal');
            const frame = document.getElementById('video-iframe');
            frame.src = ""; 
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.send("Erro ao carregar catálogo.");
    }
});

app.listen(port, () => console.log("Site MaxFlix Online"));
