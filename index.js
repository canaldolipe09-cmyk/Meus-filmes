const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 

app.get('/', async (req, res) => {
    const query = req.query.search;
    try {
        let conteudoHtml = '';
        if (query) {
            const busca = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=pt-BR&query=${query}`);
            conteudoHtml = `<h2>🔍 Resultados: ${query}</h2><div class="grid">${busca.data.results.filter(r => r.poster_path).map(r => `<div class="card" onclick="abrirPlayer('${r.media_type || 'movie'}', '${r.id}')"><img src="https://image.tmdb.org/t/p/w300${r.poster_path}"><p>${r.title || r.name}</p></div>`).join('')}</div>`;
        } else {
            const [filmes, series, animes] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`),
                axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR`),
                axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=16`)
            ]);
            conteudoHtml = `
                <h2>🎬 Filmes Populares</h2>
                <div class="row">${filmes.data.results.map(f => `<div class="card" onclick="abrirPlayer('movie', '${f.id}')"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}"></div>`).join('')}</div>
                <h2>📺 Séries</h2>
                <div class="row">${series.data.results.map(s => `<div class="card" onclick="abrirPlayer('tv', '${s.id}')"><img src="https://image.tmdb.org/t/p/w300${s.poster_path}"></div>`).join('')}</div>
                <h2>🎌 Animes</h2>
                <div class="row">${animes.data.results.map(a => `<div class="card" onclick="abrirPlayer('tv', '${a.id}')"><img src="https://image.tmdb.org/t/p/w300${a.poster_path}"></div>`).join('')}</div>
            `;
        }

        res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxFlix Oficial</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; padding-bottom: 50px; text-align: center; }
        header { background: #e50914; padding: 15px; position: sticky; top: 0; z-index: 100; }
        .search-box { margin-top: 10px; display: flex; justify-content: center; gap: 5px; }
        input { padding: 10px; border-radius: 5px; border: none; width: 65%; background: #222; color: #fff; }
        .btn-busca { background: #fff; color: #000; border: none; padding: 10px 15px; border-radius: 5px; font-weight: bold; }
        h2 { margin: 25px 15px 10px; text-align: left; font-size: 18px; color: #e50914; }
        .row { display: flex; overflow-x: auto; gap: 10px; padding: 0 15px; scrollbar-width: none; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 15px; }
        .card { min-width: 125px; cursor: pointer; transition: 0.3s; }
        .card img { width: 100%; border-radius: 10px; border: 1px solid #333; }
        #player-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 1000; }
        .nav-player { height: 60px; background: #111; display: flex; align-items: center; padding: 0 15px; justify-content: space-between; border-bottom: 2px solid #e50914; }
        .btn-fechar { background: #e50914; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; }
        iframe { width: 100%; height: calc(100% - 60px); border: none; }
    </style>
</head>
<body>
    <header>
        <div style="font-size: 24px; font-weight: bold; color: #fff;" onclick="window.location.href='/'">MAXFLIX</div>
        <form class="search-box" action="/" method="GET">
            <input type="text" name="search" placeholder="Buscar filmes, séries..." value="${query || ''}">
            <button type="submit" class="btn-busca">🔍</button>
        </form>
    </header>

    ${conteudoHtml}

    <div id="player-modal">
        <div class="nav-player">
            <button class="btn-fechar" onclick="fecharPlayer()">✕ FECHAR</button>
            <span style="font-size: 11px; color: #ffca28;">Modo Anti-Anúncio Ativado</span>
        </div>
        <iframe id="video-iframe" allowfullscreen sandbox="allow-forms allow-scripts allow-same-origin"></iframe>
    </div>

    <script>
        // BLOQUEADOR DE JANELAS (CAPTURA TENTATIVAS DE POPUP)
        window.open = function() { return { focus: function() {} }; };

        function abrirPlayer(tipo, id) {
            const modal = document.getElementById('player-modal');
            const frame = document.getElementById('video-iframe');
            
            // Usando player que detecta dublagem automaticamente
            frame.src = "https://embed.su/embed/" + (tipo === 'movie' ? 'movie' : 'tv') + "/" + id;
            
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
</html>`);
    } catch (e) {
        res.send("Erro no servidor. Tente recarregar.");
    }
});

app.listen(port, () => console.log("MaxFlix Protegido Online!"));
