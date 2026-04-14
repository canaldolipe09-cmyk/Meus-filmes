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
            conteudoHtml = `<h2 class="section-title">Resultados para: ${query}</h2><div class="grid">${busca.data.results.filter(r => r.poster_path).map(r => `<div class="card" onclick="verDetalhes('${r.media_type || 'movie'}', '${r.id}', \`${(r.title || r.name).replace(/"/g, "'")}\`, \`${(r.overview || '').replace(/"/g, "'")}\`, 'https://image.tmdb.org/t/p/w500${r.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${r.poster_path}"></div>`).join('')}</div>`;
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
        body { background: var(--bg); color: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; }
        header { padding: 15px 4%; position: fixed; width: 100%; top: 0; z-index: 1000; background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent); box-sizing: border-box; display: flex; justify-content: space-between; align-items: center;}
        .logo { color: var(--red); font-size: 24px; font-weight: bold; text-decoration: none; }
        .search-box { background: rgba(0,0,0,0.5); border: 1px solid #fff; color: #fff; padding: 5px 10px; border-radius: 4px; }
        .hero { height: 70vh; background-size: cover; background-position: center; display: flex; align-items: center; padding: 0 4%; }
        .hero-content h1 { font-size: 3rem; text-shadow: 2px 2px 4px #000; max-width: 600px; }
        .btn-play-hero { background: #fff; border: none; padding: 12px 30px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 1.2rem; transition: 0.3s; }
        .btn-play-hero:hover { background: #e6e6e6; }
        .section-title { margin: 30px 4% 10px; font-size: 1.4rem; color: #e5e5e5; }
        .row { display: flex; overflow-x: auto; gap: 10px; padding: 0 4% 20px; scrollbar-width: none; }
        .card { min-width: 160px; cursor: pointer; transition: 0.3s; }
        .card:hover { transform: scale(1.1); z-index: 2; }
        .card img { width: 100%; border-radius: 4px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; padding: 100px 4% 20px; }
        
        #modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 2000; overflow-y: auto; }
        .modal-body { max-width: 800px; margin: 0 auto; padding: 20px; text-align: center; }
        .btn-close { background: var(--red); color: #fff; border: none; padding: 10px 25px; cursor: pointer; border-radius: 5px; font-weight: bold; margin-bottom: 20px; }
        .btn-opt { background: #222; color: #fff; border: 1px solid var(--red); padding: 15px; cursor: pointer; border-radius: 8px; font-size: 1rem; font-weight: bold; width: 100%; margin-top: 10px; transition: 0.3s; }
        .btn-opt:hover { background: var(--red); }
        .player-container { width: 100%; aspect-ratio: 16/9; margin-top: 20px; display: none; background: #000; border: 2px solid #333; }
        iframe { width: 100%; height: 100%; border: none; }
        .inputs-tv { display: flex; gap: 10px; justify-content: center; margin: 15px 0; }
        .inputs-tv input { width: 80px; padding: 10px; border-radius: 5px; border: none; text-align: center; font-weight: bold; }
    </style>
</head>
<body>
    <header>
        <a href="/" class="logo">MAXFLIX</a>
        <form action="/" method="GET">
            <input type="text" name="search" class="search-box" placeholder="Títulos, pessoas, gêneros">
        </form>
    </header>

    ${conteudoHtml}

    <div id="modal">
        <div class="modal-body">
            <button class="btn-close" onclick="fechar()">✕ VOLTAR</button>
            <div id="detalhes">
                <h1 id="m-titulo"></h1>
                <p id="m-sinopse" style="color:#aaa; font-size: 16px; text-align: justify; line-height: 1.5;"></p>
                
                <div id="controles-tv" class="inputs-tv" style="display:none">
                    <div>Temp: <input type="number" id="temp" value="1" min="1"></div>
                    <div>Ep: <input type="number" id="ep" value="1" min="1"></div>
                </div>

                <p style="font-size: 0.8rem; color: var(--red);">DICA: Se não abrir dublado, procure o ícone de engrenagem ou "Audio" no player.</p>
                <button class="btn-opt" onclick="gerarPlayer('vidsrc')">▶ SERVIDOR 1 (Principal)</button>
                <button class="btn-opt" onclick="gerarPlayer('embedsu')">▶ SERVIDOR 2 (Alternativo)</button>
                <button class="btn-opt" onclick="gerarPlayer('multiembed')">▶ SERVIDOR 3 (Global)</button>
            </div>
            <div class="player-container" id="p-container">
                <iframe id="f-player" allowfullscreen sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"></iframe>
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
            document.getElementById('m-sinopse').innerText = sinopse || "Sinopse indisponível em português.";
            document.getElementById('detalhes').style.display = 'block';
            document.getElementById('p-container').style.display = 'none';
            document.getElementById('f-player').src = '';
            
            // Mostrar campos de temp/ep apenas se for série
            document.getElementById('controles-tv').style.display = (tipo === 'tv' || tipo === 'serie') ? 'flex' : 'none';
            
            document.getElementById('modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function gerarPlayer(servidor) {
            const container = document.getElementById('p-container');
            const detalhes = document.getElementById('detalhes');
            const iframe = document.getElementById('f-player');
            const s = document.getElementById('temp').value;
            const e = document.getElementById('ep').value;
            
            let url = '';

            if (servidor === 'vidsrc') {
                // Vidsrc.me com suporte a PT-BR melhorado
                url = currentTipo === 'movie' 
                    ? \`https://vidsrc.me/embed/movie?tmdb=\${currentId}&lang=pt\` 
                    : \`https://vidsrc.me/embed/tv?tmdb=\${currentId}&season=\${s}&episode=\${e}&lang=pt\`;
            } else if (servidor === 'embedsu') {
                // Servidor focado em diversos idiomas
                url = currentTipo === 'movie'
                    ? \`https://embed.su/embed/movie/\${currentId}\`
                    : \`https://embed.su/embed/tv/\${currentId}/\${s}/\${e}\`;
            } else {
                // Multiembed (Global)
                url = \`https://multiembed.mov/?video_id=\${currentId}&tmdb=1\${currentTipo === 'tv' ? '&s=' + s + '&e=' + e : ''}\`;
            }

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
        res.status(500).send("Erro ao carregar dados.");
    }
});

app.listen(port, () => console.log('Servidor rodando na porta ' + port));
