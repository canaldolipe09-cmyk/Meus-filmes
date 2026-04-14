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
            // Busca Geral (Pesquisa)
            const busca = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=pt-BR&query=${query}`);
            conteudoHtml = `
                <h2>🔍 Resultados: ${query}</h2>
                <div class="grid">
                    ${busca.data.results.filter(r => r.poster_path).map(r => `
                        <div class="card" onclick="irParaPlayer('${r.media_type || 'movie'}', '${r.id}')">
                            <img src="https://image.tmdb.org/t/p/w300${r.poster_path}">
                            <p>${r.title || r.name}</p>
                        </div>
                    `).join('')}
                </div>`;
        } else {
            // Home com Filmes, Séries e Animes
            const [filmes, series, animes] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`),
                axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR`),
                axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=16`)
            ]);

            conteudoHtml = `
                <h2>🎬 Filmes Populares</h2>
                <div class="row">${filmes.data.results.map(f => `<div class="card" onclick="irParaPlayer('movie', '${f.id}')"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}"></div>`).join('')}</div>
                
                <h2>📺 Séries em Alta</h2>
                <div class="row">${series.data.results.map(s => `<div class="card" onclick="irParaPlayer('tv', '${s.id}')"><img src="https://image.tmdb.org/t/p/w300${s.poster_path}"></div>`).join('')}</div>
                
                <h2>🎌 Melhores Animes</h2>
                <div class="row">${animes.data.results.map(a => `<div class="card" onclick="irParaPlayer('tv', '${a.id}')"><img src="https://image.tmdb.org/t/p/w300${a.poster_path}"></div>`).join('')}</div>
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
        header { background: #e50914; padding: 15px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .search-box { margin-top: 10px; display: flex; justify-content: center; gap: 5px; }
        input { padding: 10px; border-radius: 5px; border: none; width: 65%; background: #222; color: #fff; outline: none; }
        .btn-busca { background: #fff; color: #000; border: none; padding: 10px 15px; border-radius: 5px; font-weight: bold; cursor: pointer; }
        
        h2 { margin: 25px 15px 10px; text-align: left; font-size: 18px; color: #fff; text-transform: uppercase; letter-spacing: 1px; }
        .row { display: flex; overflow-x: auto; gap: 12px; padding: 0 15px; scrollbar-width: none; }
        .row::-webkit-scrollbar { display: none; }
        
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 15px; }
        .card { min-width: 130px; cursor: pointer; transition: 0.3s; }
        .card img { width: 100%; border-radius: 10px; border: 1px solid #333; }
        .card p { font-size: 11px; margin-top: 5px; color: #ccc; }
        .card:active { transform: scale(0.95); }

        .aviso { background: #222; color: #ffca28; padding: 10px; font-size: 12px; border-bottom: 1px solid #333; }
    </style>
</head>
<body>
    <header>
        <div style="font-size: 26px; font-weight: bold; cursor: pointer;" onclick="window.location.href='/'">MAXFLIX</div>
        <form class="search-box" action="/" method="GET">
            <input type="text" name="search" placeholder="Procurar filmes ou séries..." value="${query || ''}">
            <button type="submit" class="btn-busca">🔍</button>
        </form>
    </header>

    <div class="aviso">🚀 Toque no filme para abrir o Player Premium instantaneamente.</div>

    ${conteudoHtml}

    <script>
        function irParaPlayer(tipo, id) {
            // REDIRECIONAMENTO AGRESSIVO: Abre o player diretamente no navegador
            // Isso ignora qualquer bloqueio que o Render possa sofrer.
            const url = "https://vidsrc.me/embed/" + tipo + "?tmdb=" + id;
            window.location.href = url;
        }
    </script>
</body>
</html>`);
    } catch (e) {
        res.send("Erro ao carregar o catálogo. Tente atualizar a página.");
    }
});

app.listen(port, () => console.log("MaxFlix em Modo Direto Online!"));
