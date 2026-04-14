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
            conteudoHtml = `<h2 class="section-title">Resultados para: ${query}</h2><div class="grid">${busca.data.results.filter(r => r.poster_path).map(r => `<div class="card" onclick="verDetalhes('${r.media_type || 'movie'}', '${r.id}', \`${(r.title || r.name).replace(/"/g, "'")}\`, \`${(r.overview || '').replace(/"/g, "'")}\`)"><img src="https://image.tmdb.org/t/p/w300${r.poster_path}"></div>`).join('')}</div>`;
        } else {
            conteudoHtml = `
                <div class="hero" style="background-image: linear-gradient(to top, #141414, transparent), url('https://image.tmdb.org/t/p/original${destaque.backdrop_path}')">
                    <div class="hero-content">
                        <h1>${destaque.title}</h1>
                        <button class="btn-play-hero" onclick="verDetalhes('movie', '${destaque.id}', \`${destaque.title.replace(/"/g, "'")}\`, \`${destaque.overview.replace(/"/g, "'")}\`)">▶ Assistir</button>
                    </div>
                </div>
                <h2 class="section-title">🎬 Filmes Populares</h2>
                <div class="row">${filmes.data.results.map(f => `<div class="card" onclick="verDetalhes('movie', '${f.id}', \`${f.title.replace(/"/g, "'")}\`, \`${f.overview.replace(/"/g, "'")}\`)"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}"></div>`).join('')}</div>
                <h2 class="section-title">📺 Séries e Animes</h2>
                <div class="row">${series.data.results.map(s => `<div class="card" onclick="verDetalhes('tv', '${s.id}', \`${s.name.replace(/"/g, "'")}\`, \`${s.overview.replace(/"/g, "'")}\`)"><img src="https://image.tmdb.org/t/p/w300${s.poster_path}"></div>`).join('')}</div>
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
        body { background: var(--bg); color: #fff; font-family: Arial, sans-serif; margin: 0; overflow-x: hidden; }
        header { padding: 15px 4%; position: fixed; width: 100%; top: 0; z-index: 1000; background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent); display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; }
        .logo { color: var(--red); font-size: 24px; font-weight: bold; text-decoration: none; }
        .search-box { background: rgba(0,0,0,0.6); border: 1px solid #555; color: #fff; padding: 8px; border-radius: 4px; }
        .hero { height: 60vh; background-size: cover; background-position: center; display: flex; align-items: center; padding: 0 4%; }
        .hero-content h1 { font-size: 2.5rem; text-shadow: 2px 2px 4px #000; margin-bottom: 20px; }
        .btn-play-hero { background: #fff; border: none; padding: 12px 25px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 1rem; }
        .section-title { margin: 20px 4%; font-size: 1.2rem; border-left: 3px solid var(--red); padding-left: 10px; }
        .row { display: flex; overflow-x: auto; gap: 10px; padding: 0 4% 20px; scrollbar-width: none; }
        .card { min-width: 140px; cursor: pointer; transition: 0.3s; }
        .card:hover { transform: scale(1.08); }
        .card img { width: 100%; border-radius: 4px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; padding: 90px 4% 20px; }
        
        #modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; overflow-y: auto; }
        .modal-body { max-width: 800px; margin: 20px auto; padding: 20px; background: #111; border-radius: 8px; position: relative; }
        .btn-close { background: var(--red); color: #fff; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; font-weight: bold; margin-bottom: 15px; }
        .btn-opt { background: #222; color: #fff; border: 1px solid #444; padding: 15px; cursor: pointer; border-radius: 8px; font-size: 1rem; width: 100%; margin-top: 10px; text-align: left; }
        .btn-opt:hover { border-color: var(--red); background: #2a2a2a; }
        .player-container { width: 100%; aspect-ratio: 16/9; margin-top: 20px; display: none; background: #000; }
        iframe { width: 100%; height: 100%; border: none; }
        .selector { margin: 15px 0; display: flex; gap: 10px; align-items: center; justify-content: center; background: #222; padding: 10px; border-radius: 5px; }
        .selector input { width: 60px; padding: 5px; border-radius: 4px; border: none; }
    </style>
</head>
<body>
    <header>
        <a href="/" class="logo">MAXFLIX</a>
        <form action="/" method="GET"><input type="text" name="search" class="search-box" placeholder="Buscar..."></form>
    </header>

    ${conteudoHtml}

    <div id="modal">
        <div class="modal-body">
            <button class="btn-close" onclick="fechar()">✕ FECHAR</button>
            <div id="detalhes">
                <h1 id="m-titulo"></h1>
                <p id="m-sinopse" style="color:#ccc; line-height: 1.4;"></p>
                
                <div id="area-serie" class="selector" style="display:none">
                    Temporada: <input type="number" id="temp" value="1" min="1">
                    Episódio: <input type="number" id="ep" value="1" min="1">
                </div>

                <p style="color: var(--red); font-size: 12px;">DICA: Se abrir propaganda, feche-a. Dublagem disponível nas opções do player.</p>
                <button class="btn-opt" onclick="gerarPlayer('vidsrc')">▶ Servidor 1 (Mais Dublados)</button>
                <button class="btn-opt" onclick="gerarPlayer('embedsu')">▶ Servidor 2 (Rápido)</button>
                <button class="btn-opt" onclick="gerarPlayer('multi')">▶ Servidor 3 (Global - Se os outros falharem)</button>
            </div>
            <div class="player-container" id="p-container">
                <iframe id="f-player" allowfullscreen></iframe>
            </div>
        </div>
    </div>

    <script>
        let currentId = '';
        let currentTipo = '';

        function verDetalhes(tipo, id, titulo, sinopse) {
            currentId = id;
            currentTipo = tipo;
            document.getElementById('m-titulo').innerText = titulo;
            document.getElementById('m-sinopse').innerText = sinopse || "Sem descrição disponível.";
            document.getElementById('area-serie').style.display = (tipo === 'tv') ? 'flex' : 'none';
            document.getElementById('detalhes').style.display = 'block';
            document.getElementById('p-container').style.display = 'none';
            document.getElementById('f-player').src = '';
            document.getElementById('modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function gerarPlayer(servidor) {
            const iframe = document.getElementById('f-player');
            const s = document.getElementById('temp').value;
            const e = document.getElementById('ep').value;
            let url = '';

            // Ajuste do Sandbox baseado no servidor
            if (servidor === 'multi') {
                // Multiembed é chato com sandbox, então liberamos mais um pouco
                iframe.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation-by-user-activation');
                url = \`https://multiembed.mov/?video_id=\${currentId}&tmdb=1\${currentTipo === 'tv' ? '&s=' + s + '&e=' + e : ''}\`;
            } else {
                // Servidores 1 e 2 funcionam bem com sandbox restrito
                iframe.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-same-origin allow-scripts');
                if (servidor === 'vidsrc') {
                    url = currentTipo === 'movie' 
                        ? \`https://vidsrc.xyz/embed/movie?tmdb=\${currentId}\` 
                        : \`https://vidsrc.xyz/embed/tv?tmdb=\${currentId}&season=\${s}&episode=\${e}\`;
                } else {
                    url = currentTipo === 'movie'
                        ? \`https://embed.su/embed/movie/\${currentId}\`
                        : \`https://embed.su/embed/tv/\${currentId}/\${s}/\${e}\`;
                }
            }

            document.getElementById('detalhes').style.display = 'none';
            document.getElementById('p-container').style.display = 'block';
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
        res.status(500).send("Erro no servidor.");
    }
});

app.listen(port, () => console.log('Servidor ONLINE'));
