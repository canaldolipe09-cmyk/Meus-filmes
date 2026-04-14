const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 

app.get('/', async (req, res) => {
    const query = req.query.search;
    try {
        const [filmes, series] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`),
            axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR`)
        ]);

        const destaque = filmes.data.results[0];
        let conteudoHtml = '';

        if (query) {
            const busca = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=pt-BR&query=${query}`);
            conteudoHtml = `<h2 class="section-title">Resultados</h2><div class="grid">${busca.data.results.filter(r => r.poster_path).map(r => `<div class="card" onclick="verDetalhes('${r.media_type || 'movie'}', '${r.id}', \`${(r.title || r.name).replace(/"/g, "'")}\`, \`${(r.overview || '').replace(/"/g, "'")}\`, 'https://image.tmdb.org/t/p/w500${r.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${r.poster_path}"></div>`).join('')}</div>`;
        } else {
            conteudoHtml = `
                <div class="hero" style="background-image: linear-gradient(to top, #141414, transparent), url('https://image.tmdb.org/t/p/original${destaque.backdrop_path}')">
                    <div class="hero-content">
                        <h1>${destaque.title}</h1>
                        <button class="btn-play-hero" onclick="verDetalhes('movie', '${destaque.id}', \`${destaque.title.replace(/"/g, "'")}\`, \`${destaque.overview.replace(/"/g, "'")}\`, 'https://image.tmdb.org/t/p/w500${destaque.poster_path}')">▶ Assistir</button>
                    </div>
                </div>
                <h2 class="section-title">🎬 Filmes Populares</h2>
                <div class="row">${filmes.data.results.map(f => `<div class="card" onclick="verDetalhes('movie', '${f.id}', \`${f.title.replace(/"/g, "'")}\`, \`${f.overview.replace(/"/g, "'")}\`, 'https://image.tmdb.org/t/p/w500${f.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}"></div>`).join('')}</div>
                <h2 class="section-title">📺 Séries e Animes</h2>
                <div class="row">${series.data.results.map(s => `<div class="card" onclick="verDetalhes('tv', '${s.id}', \`${s.name.replace(/"/g, "'")}\`, \`${s.overview.replace(/"/g, "'")}\`, 'https://image.tmdb.org/t/p/w500${s.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${s.poster_path}"></div>`).join('')}</div>
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
        body { background: var(--bg); color: #fff; font-family: Arial, sans-serif; margin: 0; }
        header { padding: 15px 4%; position: fixed; width: 100%; top: 0; z-index: 1000; background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent); }
        .logo { color: var(--red); font-size: 24px; font-weight: bold; text-decoration: none; }
        .hero { height: 50vh; background-size: cover; background-position: center; display: flex; align-items: center; padding: 0 4%; }
        .hero-content h1 { font-size: 2rem; text-shadow: 2px 2px 4px #000; }
        .btn-play-hero { background: #fff; border: none; padding: 12px 25px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 1rem; }
        .section-title { margin: 20px 4%; font-size: 1.2rem; border-left: 3px solid var(--red); padding-left: 10px; }
        .row { display: flex; overflow-x: auto; gap: 10px; padding: 0 4%; scrollbar-width: none; }
        .card { min-width: 140px; cursor: pointer; transition: 0.3s; }
        .card:hover { transform: scale(1.05); }
        .card img { width: 100%; border-radius: 4px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px; padding: 80px 4% 20px; }
        
        #modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 2000; overflow-y: auto; }
        .modal-body { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
        .btn-close { background: var(--red); color: #fff; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; font-weight: bold; margin-bottom: 20px; }
        .btn-opt { background: #222; color: #fff; border: 1px solid var(--red); padding: 18px; cursor: pointer; border-radius: 8px; font-size: 1.1rem; font-weight: bold; width: 100%; margin-top: 10px; }
        .player-container { width: 100%; aspect-ratio: 16/9; margin-top: 20px; display: none; background: #000; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <header><a href="/" class="logo">MAXFLIX</a></header>
    ${conteudoHtml}

    <div id="modal">
        <div class="modal-body">
            <button class="btn-close" onclick="fechar()">✕ VOLTAR</button>
            <div id="detalhes">
                <h1 id="m-titulo"></h1>
                <p id="m-sinopse" style="color:#aaa; font-size: 14px; text-align: left;"></p>
                <button class="btn-opt" onclick="gerarPlayer(1)">▶ ASSISTIR SERVIDOR 1 (Recomendado)</button>
                <button class="btn-opt" onclick="gerarPlayer(2)">▶ ASSISTIR SERVIDOR 2</button>
            </div>
            <div class="player-container" id="p-container">
                <iframe id="f-player" allowfullscreen></iframe>
            </div>
        </div>
    </div>

    <script>
        let currentId = '';
        let currentTipo = '';

        function verDetalhes(tipo, id, titulo, sinopse, img) {
            currentId = id;
            currentTipo = tipo;
            document.getElementById('m-titulo').innerText = titulo;
            document.getElementById('m-sinopse').innerText = sinopse || "Sinopse indisponível.";
            document.getElementById('detalhes').style.display = 'block';
            document.getElementById('p-container').style.display = 'none';
            document.getElementById('f-player').src = '';
            document.getElementById('modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function gerarPlayer(servidor) {
            const container = document.getElementById('p-container');
            const detalhes = document.getElementById('detalhes');
            const iframe = document.getElementById('f-player');
            
            let url = '';
            if (servidor === 1) {
                // Link superembed com cabeçalho de limpeza
                url = "https://multiembed.mov/?video_id=" + currentId + "&tmdb=1";
            } else {
                // Alternativa vidsrc
                const t = (currentTipo === 'movie' ? 'movie' : 'tv');
                url = "https://vidsrc.me/embed/" + t + "?tmdb=" + currentId;
            }

            // O SEGREDO: Forçar o carregamento sem sandbox restritivo via JS
            detalhes.style.display = 'none';
            container.style.display = 'block';
            iframe.src = url;
        }

        function fechar() { 
            document.getElementById('modal').style.display = 'none'; 
            document.getElementById('f-player').src = '';
            document.body.style.overflow = 'auto'; 
        }
    </script>
</body>
</html>
        `);
    } catch (error) {
        res.status(500).send("Erro");
    }
});

app.listen(port, () => console.log('Servidor ON'));
