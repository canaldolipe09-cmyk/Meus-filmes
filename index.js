const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 

app.get('/', async (req, res) => {
    const query = req.query.search;
    try {
        const [filmes, series, animes] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`),
            axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR`),
            axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=16`)
        ]);

        const destaque = filmes.data.results[0];
        let conteudoHtml = '';

        if (query) {
            const busca = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=pt-BR&query=${query}`);
            conteudoHtml = `<h2 class="section-title">Resultados</h2><div class="grid">${busca.data.results.filter(r => r.poster_path).map(r => `<div class="card" onclick="verDetalhes('${r.media_type || 'movie'}', '${r.id}', \`${(r.title || r.name).replace(/"/g, "'")}\`, \`${(r.overview || '').replace(/"/g, "'")}\`, '${r.vote_average}', 'https://image.tmdb.org/t/p/w500${r.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${r.poster_path}"></div>`).join('')}</div>`;
        } else {
            conteudoHtml = `
                <div class="hero" style="background-image: linear-gradient(to top, #141414, transparent), url('https://image.tmdb.org/t/p/original${destaque.backdrop_path}')">
                    <div class="hero-content">
                        <h1>${destaque.title}</h1>
                        <button class="btn-play-hero" onclick="verDetalhes('movie', '${destaque.id}', \`${destaque.title.replace(/"/g, "'")}\`, \`${destaque.overview.replace(/"/g, "'")}\`, '${destaque.vote_average}', 'https://image.tmdb.org/t/p/w500${destaque.poster_path}')">▶ Assistir</button>
                    </div>
                </div>
                <h2 class="section-title">🎬 Filmes Populares</h2>
                <div class="row">${filmes.data.results.map(f => `<div class="card" onclick="verDetalhes('movie', '${f.id}', \`${f.title.replace(/"/g, "'")}\`, \`${f.overview.replace(/"/g, "'")}\`, '${f.vote_average}', 'https://image.tmdb.org/t/p/w500${f.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}"></div>`).join('')}</div>
                <h2 class="section-title">📺 Séries</h2>
                <div class="row">${series.data.results.map(s => `<div class="card" onclick="verDetalhes('tv', '${s.id}', \`${s.name.replace(/"/g, "'")}\`, \`${s.overview.replace(/"/g, "'")}\`, '${s.vote_average}', 'https://image.tmdb.org/t/p/w500${s.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${s.poster_path}"></div>`).join('')}</div>
            `;
        }

        res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAXFLIX</title>
    <style>
        :root { --red: #e50914; --bg: #141414; }
        body { background: var(--bg); color: #fff; font-family: Arial; margin: 0; }
        header { padding: 15px 4%; position: fixed; width: 100%; top: 0; z-index: 1000; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent); }
        .logo { color: var(--red); font-size: 24px; font-weight: bold; text-decoration: none; }
        .hero { height: 60vh; background-size: cover; background-position: center; display: flex; align-items: center; padding: 0 4%; }
        .btn-play-hero { background: #fff; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; border-radius: 4px; }
        .section-title { margin: 20px 4%; font-size: 1.2rem; }
        .row { display: flex; overflow-x: auto; gap: 10px; padding: 0 4%; scrollbar-width: none; }
        .card { min-width: 130px; cursor: pointer; transition: 0.3s; }
        .card:hover { transform: scale(1.05); }
        .card img { width: 100%; border-radius: 4px; }
        
        /* MODAL */
        #modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 2000; overflow-y: auto; }
        .modal-body { max-width: 700px; margin: 0 auto; padding: 20px; }
        .btn-close { background: var(--red); color: #fff; border: none; padding: 10px; cursor: pointer; float: right; }
        .player-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
        .btn-opt { background: #333; color: #fff; border: 1px solid #555; padding: 15px; cursor: pointer; border-radius: 5px; font-weight: bold; }
        .btn-opt:hover { background: var(--red); }
        .tag { color: #46d369; font-weight: bold; margin-bottom: 10px; display: block; }
    </style>
</head>
<body>
    <header><a href="/" class="logo">MAXFLIX</a></header>
    ${conteudoHtml}

    <div id="modal">
        <div class="modal-body">
            <button class="btn-close" onclick="fechar()">FECHAR</button>
            <img id="m-img" style="width:100%; border-radius: 10px; margin-top:20px;">
            <h1 id="m-titulo"></h1>
            <span class="tag">✅ Áudio: Português / Dublado</span>
            <p id="m-sinopse" style="color:#ccc;"></p>
            
            <h3>Escolha o Servidor (Dublado):</h3>
            <div class="player-options">
                <button class="btn-opt" id="opt1">OPÇÃO 1 (Principal)</button>
                <button class="btn-opt" id="opt2">OPÇÃO 2 (Alternativa)</button>
            </div>
            <p style="font-size: 12px; color: #888; margin-top: 15px;">Dica: Se o vídeo abrir em inglês, use a OPÇÃO 2.</p>
        </div>
    </div>

    <script>
        function verDetalhes(tipo, id, titulo, sinopse, nota, img) {
            document.getElementById('m-img').src = img;
            document.getElementById('m-titulo').innerText = titulo;
            document.getElementById('m-sinopse').innerText = sinopse;
            
            // OPÇÃO 1: Warez (Focado em Dublagem de Séries)
            document.getElementById('opt1').onclick = function() {
                let path = (tipo === 'movie') ? 'movie/' : 'serie/';
                window.location.href = "https://embed.warezcdn.net/" + path + id;
            };

            // OPÇÃO 2: SuperVídeos (O melhor para filmes Dublados sem erro)
            document.getElementById('opt2').onclick = function() {
                window.location.href = "https://embed.su/embed/" + (tipo === 'movie' ? 'movie' : 'tv') + "/" + id;
            };

            document.getElementById('modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        function fechar() { document.getElementById('modal').style.display = 'none'; document.body.style.overflow = 'auto'; }
    </script>
</body>
</html>
