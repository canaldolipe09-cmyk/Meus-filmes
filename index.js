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

        const destaque = filmes.data.results[Math.floor(Math.random() * filmes.data.results.length)];

        let conteudoHtml = '';
        if (query) {
            const busca = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=pt-BR&query=${query}`);
            conteudoHtml = `
                <h2 class="section-title">Resultados para: ${query}</h2>
                <div class="grid">
                    ${busca.data.results.filter(r => r.poster_path).map(r => `
                        <div class="card" onclick="verDetalhes('${r.media_type || 'movie'}', '${r.id}', \`${(r.title || r.name).replace(/"/g, "'")}\`, \`${(r.overview || '').replace(/"/g, "'")}\`, '${r.vote_average}', 'https://image.tmdb.org/t/p/w500${r.poster_path}')">
                            <img src="https://image.tmdb.org/t/p/w300${r.poster_path}">
                        </div>
                    `).join('')}
                </div>`;
        } else {
            conteudoHtml = `
                <div class="hero" style="background-image: linear-gradient(to top, var(--dark-bg), transparent), url('https://image.tmdb.org/t/p/original${destaque.backdrop_path}')">
                    <div class="hero-content">
                        <h1>${destaque.title}</h1>
                        <p>${destaque.overview.substring(0, 150)}...</p>
                        <button class="btn-play-hero" onclick="verDetalhes('movie', '${destaque.id}', \`${destaque.title.replace(/"/g, "'")}\`, \`${destaque.overview.replace(/"/g, "'")}\`, '${destaque.vote_average}', 'https://image.tmdb.org/t/p/w500${destaque.poster_path}')">▶ Assistir</button>
                    </div>
                </div>
                <h2 class="section-title">🎬 Filmes Populares</h2>
                <div class="row">${filmes.data.results.map(f => `<div class="card" onclick="verDetalhes('movie', '${f.id}', \`${f.title.replace(/"/g, "'")}\`, \`${f.overview.replace(/"/g, "'")}\`, '${f.vote_average}', 'https://image.tmdb.org/t/p/w500${f.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}"></div>`).join('')}</div>
                <h2 class="section-title">📺 Séries Dubladas</h2>
                <div class="row">${series.data.results.map(s => `<div class="card" onclick="verDetalhes('tv', '${s.id}', \`${s.name.replace(/"/g, "'")}\`, \`${s.overview.replace(/"/g, "'")}\`, '${s.vote_average}', 'https://image.tmdb.org/t/p/w500${s.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${s.poster_path}"></div>`).join('')}</div>
                <h2 class="section-title">🎌 Melhores Animes</h2>
                <div class="row">${animes.data.results.map(a => `<div class="card" onclick="verDetalhes('tv', '${a.id}', \`${a.name.replace(/"/g, "'")}\`, \`${a.overview.replace(/"/g, "'")}\`, '${a.vote_average}', 'https://image.tmdb.org/t/p/w500${a.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${a.poster_path}"></div>`).join('')}</div>
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
        :root { --main-red: #e50914; --dark-bg: #141414; }
        body { background: var(--dark-bg); color: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding-bottom: 40px; }
        header { padding: 15px 4%; position: fixed; width: 100%; top: 0; z-index: 1000; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); transition: 0.5s; }
        .logo { color: var(--main-red); font-size: 28px; font-weight: bold; text-decoration: none; }
        .search-box { display: flex; align-items: center; background: rgba(0,0,0,0.6); border: 1px solid #555; padding: 5px 10px; border-radius: 4px; }
        .search-box input { background: transparent; border: none; color: #fff; outline: none; width: 100px; transition: 0.3s; }
        .search-box input:focus { width: 180px; }
        .search-box button { background: transparent; border: none; color: #fff; cursor: pointer; }

        .hero { height: 70vh; background-size: cover; background-position: center; display: flex; align-items: center; padding: 0 4%; }
        .hero-content { max-width: 600px; text-shadow: 2px 2px 10px #000; }
        .hero-content h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .hero-content p { font-size: 1rem; line-height: 1.4; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .btn-play-hero { background: #fff; color: #000; border: none; padding: 10px 25px; border-radius: 4px; font-size: 1.1rem; font-weight: bold; cursor: pointer; }

        .section-title { margin: 30px 4% 10px; font-size: 1.2rem; font-weight: bold; }
        .row { display: flex; overflow-x: auto; gap: 8px; padding: 0 4%; scrollbar-width: none; }
        .row::-webkit-scrollbar { display: none; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; padding: 0 4%; }
        
        .card { min-width: 140px; transition: 0.3s; cursor: pointer; border-radius: 4px; overflow: hidden; }
        .card:hover { transform: scale(1.08); z-index: 10; }
        .card img { width: 100%; display: block; border-radius: 4px; }

        #detalhes-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 2000; overflow-y: auto; }
        .modal-content { max-width: 700px; margin: 20px auto; background: #181818; border-radius: 8px; overflow: hidden; position: relative; }
        .modal-banner { width: 100%; height: 300px; background-size: cover; background-position: center; }
        .modal-info { padding: 25px; }
        .btn-close { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.7); color: #fff; border: none; width: 35px; height: 35px; border-radius: 50%; font-size: 18px; cursor: pointer; z-index: 10; }
        .modal-play { background: #fff; color: #000; border: none; padding: 15px; border-radius: 4px; font-size: 1.1rem; font-weight: bold; cursor: pointer; width: 100%; margin-top: 20px; }
        .tag-dub { background: #333; color: #46d369; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-right: 10px; }
    </style>
</head>
<body>
    <header id="nav">
        <a href="/" class="logo">MAXFLIX</a>
        <form class="search-box" action="/" method="GET">
            <input type="text" name="search" placeholder="Buscar..." value="${query || ''}">
            <button type="submit">🔍</button>
        </form>
    </header>

    ${conteudoHtml}

    <div id="detalhes-modal">
        <div class="modal-content">
            <button class="btn-close" onclick="fecharModal()">✕</button>
            <div id="m-banner" class="modal-banner"></div>
            <div class="modal-info">
                <h1 id="m-titulo" style="margin-top:0;"></h1>
                <div>
                    <span class="tag-dub">Dublado</span>
                    <span id="m-nota" style="color: #46d369; font-weight: bold;"></span>
                </div>
                <p id="m-sinopse" style="color: #ccc; line-height: 1.5; margin-top: 15px;"></p>
                <button id="btn-assistir" class="modal-play">▶ Assistir Agora</button>
            </div>
        </div>
    </div>

    <script>
        window.onscroll = function() {
            var nav = document.getElementById('nav');
            if (window.pageYOffset > 50) { nav.style.background = "#141414"; } 
            else { nav.style.background = "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)"; }
        };

        function verDetalhes(tipo, id, titulo, sinopse, nota, img) {
            document.getElementById('m-banner').style.backgroundImage = "url('" + img + "')";
            document.getElementById('m-titulo').innerText = titulo;
            document.getElementById('m-sinopse').innerText = sinopse || "Sinopse em breve...";
            document.getElementById('m-nota').innerText = (parseFloat(nota) * 10).toFixed(0) + "% Relevante";
            
            document.getElementById('btn-assistir').onclick = function() {
                // REDIRECIONAMENTO DIRETO PARA PLAYER DUBLADO (WarezCDN)
                let path = (tipo === 'movie') ? 'movie/' : 'serie/';
                window.location.href = "https://embed.warezcdn.net/" + path + id;
            };
            
            document.getElementById('detalhes-modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function fecharModal() {
            document.getElementById('detalhes-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    </script>
</body>
</html>`);
    } catch (e) {
        res.send("Erro ao carregar MaxFlix.");
    }
});

app.listen(port, () => console.log("MaxFlix Pro Português Online!"));
