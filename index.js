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
            conteudoHtml = `
                <h2 class="section-title">🔍 Resultados para: ${query}</h2>
                <div class="grid">
                    ${busca.data.results.filter(r => r.poster_path).map(r => `
                        <div class="card" onclick="verDetalhes('${r.media_type || 'movie'}', '${r.id}', \`${(r.title || r.name).replace(/"/g, "'")}\`, \`${(r.overview || 'Sem sinopse disponível.').replace(/"/g, "'")}\`, '${r.vote_average}', 'https://image.tmdb.org/t/p/w500${r.poster_path}')">
                            <img src="https://image.tmdb.org/t/p/w300${r.poster_path}">
                            <div class="card-info">
                                <span class="nota">⭐ ${r.vote_average.toFixed(1)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>`;
        } else {
            const [filmes, series, animes] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`),
                axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR`),
                axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=16`)
            ]);

            conteudoHtml = `
                <h2 class="section-title">🎬 Filmes em Destaque</h2>
                <div class="row">${filmes.data.results.map(f => `<div class="card" onclick="verDetalhes('movie', '${f.id}', \`${f.title.replace(/"/g, "'")}\`, \`${f.overview.replace(/"/g, "'")}\`, '${f.vote_average}', 'https://image.tmdb.org/t/p/w500${f.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}"></div>`).join('')}</div>
                
                <h2 class="section-title">📺 Séries Populares</h2>
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
    <title>MaxFlix Premium</title>
    <style>
        :root { --main-red: #e50914; --dark-bg: #0a0a0a; --card-bg: #1a1a1a; }
        body { background: var(--dark-bg); color: #fff; font-family: 'Segoe UI', Roboto, sans-serif; margin: 0; overflow-x: hidden; }
        
        header { background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); padding: 20px; position: fixed; width: 100%; top: 0; z-index: 1000; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; }
        .logo { color: var(--main-red); font-size: 30px; font-weight: 900; letter-spacing: -1px; cursor: pointer; text-decoration: none; margin-bottom: 10px; }
        
        .search-box { width: 90%; max-width: 500px; display: flex; background: rgba(255,255,255,0.1); border-radius: 20px; padding: 5px 15px; backdrop-filter: blur(10px); }
        .search-box input { background: transparent; border: none; color: #fff; padding: 10px; width: 100%; outline: none; }
        .search-box button { background: transparent; border: none; color: #fff; cursor: pointer; font-size: 18px; }

        .content { margin-top: 140px; padding-bottom: 50px; }
        .section-title { margin: 25px 20px 10px; font-size: 20px; border-left: 4px solid var(--main-red); padding-left: 10px; }
        
        .row { display: flex; overflow-x: auto; gap: 15px; padding: 10px 20px; scrollbar-width: none; }
        .row::-webkit-scrollbar { display: none; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 15px; padding: 20px; }
        
        .card { min-width: 120px; position: relative; transition: transform 0.3s ease; border-radius: 8px; overflow: hidden; cursor: pointer; }
        .card:hover { transform: scale(1.05); z-index: 2; }
        .card img { width: 100%; display: block; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        .nota { position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px; font-size: 10px; color: #ffca28; }

        /* MODAL DE DETALHES */
        #detalhes-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; overflow-y: auto; }
        .modal-body { max-width: 600px; margin: 0 auto; padding: 20px; position: relative; }
        .btn-close { position: absolute; top: 20px; right: 20px; background: var(--main-red); color: #fff; border: none; padding: 10px 15px; border-radius: 50%; font-weight: bold; cursor: pointer; }
        .modal-img { width: 100%; border-radius: 15px; margin-top: 40px; }
        .modal-titulo { font-size: 28px; margin: 20px 0 10px; }
        .modal-info { display: flex; gap: 15px; color: #aaa; margin-bottom: 15px; }
        .modal-sinopse { line-height: 1.6; color: #ddd; margin-bottom: 30px; }
        .btn-play { background: var(--main-red); color: #fff; border: none; padding: 15px; width: 100%; border-radius: 10px; font-size: 18px; font-weight: bold; cursor: pointer; }
    </style>
</head>
<body>
    <header>
        <a href="/" class="logo">MAXFLIX</a>
        <form class="search-box" action="/" method="GET">
            <input type="text" name="search" placeholder="O que vamos assistir hoje?" value="${query || ''}">
            <button type="submit">🔍</button>
        </form>
    </header>

    <div class="content">
        ${conteudoHtml}
    </div>

    <div id="detalhes-modal">
        <div class="modal-body">
            <button class="btn-close" onclick="fecharModal()">✕</button>
            <img id="m-img" class="modal-img">
            <h1 id="m-titulo" class="modal-titulo"></h1>
            <div class="modal-info">
                <span id="m-nota" style="color: #ffca28; font-weight: bold;"></span>
                <span>•</span>
                <span>Português / Dublado</span>
            </div>
            <p id="m-sinopse" class="modal-sinopse"></p>
            <button id="btn-assistir" class="btn-play">▶ ASSISTIR AGORA</button>
        </div>
    </div>

    <script>
        function verDetalhes(tipo, id, titulo, sinopse, nota, img) {
            document.getElementById('m-img').src = img;
            document.getElementById('m-titulo').innerText = titulo;
            document.getElementById('m-sinopse').innerText = sinopse || "Nenhuma sinopse disponível em português.";
            document.getElementById('m-nota').innerText = "⭐ " + parseFloat(nota).toFixed(1);
            
            // Configura o botão de play para o redirecionamento agressivo
            document.getElementById('btn-assistir').onclick = function() {
                window.location.href = "https://vidsrc.me/embed/" + tipo + "?tmdb=" + id;
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
        res.send("Houve um erro técnico. Tente atualizar a página.");
    }
});

app.listen(port, () => console.log("MaxFlix Pro Online"));
