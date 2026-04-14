        const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 

app.get('/', async (req, res) => {
    try {
        // Busca as listas automáticas do TMDB
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
    <title>MaxFlix Premium</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; padding-bottom: 50px; }
        header { background: #e50914; padding: 15px; font-weight: bold; font-size: 22px; position: sticky; top: 0; z-index: 100; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.8); }
        h2 { margin: 25px 0 10px 15px; text-align: left; color: #fff; font-size: 18px; font-weight: bold; }
        
        /* Fileiras que deslizam para o lado */
        .row { display: flex; overflow-x: auto; gap: 12px; padding: 0 15px; scrollbar-width: none; }
        .row::-webkit-scrollbar { display: none; }
        
        .card { min-width: 130px; transition: 0.3s; }
        .card img { width: 100%; border-radius: 10px; border: 1px solid #333; display: block; }
        .card:active { transform: scale(0.9); }

        /* Estilo do Player */
        #player-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 1000; }
        .nav-player { height: 60px; background: #111; display: flex; align-items: center; padding: 0 15px; justify-content: space-between; border-bottom: 2px solid #e50914; }
        .btn-fechar { background: #e50914; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; }
        iframe { width: 100%; height: calc(100% - 60px); border: none; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>

    <h2>🎬 Filmes de Sucesso</h2>
    <div class="row">
        ${filmes.data.results.map(f => `<div class="card" onclick="abrirPlayer('movie', '${f.id}')"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}"></div>`).join('')}
    </div>

    <h2>📺 Séries em Alta</h2>
    <div class="row">
        ${series.data.results.map(s => `<div class="card" onclick="abrirPlayer('tv', '${s.id}')"><img src="https://image.tmdb.org/t/p/w300${s.poster_path}"></div>`).join('')}
    </div>

    <h2>🎌 Melhores Animes</h2>
    <div class="row">
        ${animes.data.results.map(a => `<div class="card" onclick="abrirPlayer('tv', '${a.id}')"><img src="https://image.tmdb.org/t/p/w300${a.poster_path}"></div>`).join('')}
    </div>

    <div id="player-modal">
        <div class="nav-player">
            <button class="btn-fechar" onclick="fecharPlayer()">✕ VOLTAR</button>
            <span style="font-size: 14px; color: #ffca28;">Clique no ícone de lista para episódios ☰</span>
        </div>
        <iframe id="video-iframe" allowfullscreen></iframe>
    </div>

    <script>
        function abrirPlayer(tipo, id) {
            const modal = document.getElementById('player-modal');
            const frame = document.getElementById('video-iframe');
            
            // O Vidsrc.xyz gera automaticamente o menu de episódios para séries (TV)
            let url = "";
            if(tipo === 'movie') {
                url = "https://vidsrc.xyz/embed/movie/" + id;
            } else {
                url = "https://vidsrc.xyz/embed/tv/" + id;
            }
            
            frame.src = url;
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
        res.send("Erro ao carregar o catálogo. Verifique sua conexão.");
    }
});

app.listen(port, () => console.log("Site MaxFlix Rodando!"));
