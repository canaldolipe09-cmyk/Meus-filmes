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
        body { background: var(--bg); color: #fff; font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; overflow-x: hidden; }
        header { padding: 15px 4%; position: fixed; width: 100%; top: 0; z-index: 1000; background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent); display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; }
        .logo { color: var(--red); font-size: 24px; font-weight: bold; text-decoration: none; }
        .search-form input { background: rgba(0,0,0,0.6); border: 1px solid #fff; color: white; padding: 5px 10px; border-radius: 4px; outline: none; }
        
        .hero { height: 60vh; background-size: cover; background-position: center; display: flex; align-items: center; padding: 0 4%; transition: 0.5s; }
        .hero-content h1 { font-size: 2.5rem; text-shadow: 2px 2px 4px #000; margin-bottom: 15px; }
        .btn-play-hero { background: #fff; border: none; padding: 12px 30px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 1rem; transition: 0.3s; }
        .btn-play-hero:hover { background: rgba(255,255,255,0.8); }

        .section-title { margin: 25px 4% 10px; font-size: 1.2rem; border-left: 4px solid var(--red); padding-left: 10px; }
        .row { display: flex; overflow-x: auto; gap: 10px; padding: 0 4% 20px; scrollbar-width: none; }
        .row::-webkit-scrollbar { display: none; }
        .card { min-width: 150px; cursor: pointer; transition: 0.3s; }
        .card:hover { transform: scale(1.08); z-index: 2; }
        .card img { width: 100%; border-radius: 4px; box-shadow: 0 4px 8px rgba(0,0,0,0.5); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; padding: 80px 4% 20px; }
        
        /* Modal do Player */
        #modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; overflow-y: auto; }
        .modal-body { max-width: 800px; margin: 0 auto; padding: 20px; text-align: center; }
        .btn-close { background: var(--red); color: #fff; border: none; padding: 10px 25px; cursor: pointer; border-radius: 5px; font-weight: bold; margin-bottom: 20px; }
        
        #video-container { width: 100%; aspect-ratio: 16/9; background: #000; margin-top: 20px; border-radius: 8px; overflow: hidden; display: none; }
        .player-options { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
        .btn-opt { background: #222; color: #fff; border: 1px solid var(--red); padding: 15px; cursor: pointer; border-radius: 8px; font-size: 1rem; font-weight: bold; transition: 0.3s; }
        .btn-opt:hover { background: var(--red); }
        
        .info-container { text-align: left; margin-top: 20px; }
        .tag-dub { color: #46d369; font-weight: bold; margin-bottom: 10px; display: block; }
    </style>
</head>
<body>
    <header>
        <a href="/" class="logo">MAXFLIX</a>
        <form action="/" method="GET" class="search-form">
            <input type="text" name="search" placeholder="Buscar filmes ou séries...">
        </form>
    </header>

    ${conteudoHtml}

    <div id="modal">
        <div class="modal-body">
            <button class="btn-close" onclick="fechar()">✕ VOLTAR</button>
            
            <div id="video-container">
                <iframe id="videoFrame" width="100%" height="100%" frameborder="0" allowfullscreen sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"></iframe>
            </div>

            <div id="detalhes-filme">
                <img id="m-img" style="width:200px; border-radius: 8px; float: left; margin-right: 20px;">
                <div class="info-container">
                    <h1 id="m-titulo" style="margin-top:0;"></h1>
                    <span class="tag-dub">🔊 Áudio: Português (Dublado)</span>
                    <p id="m-sinopse" style="color:#ccc; line-height: 1.5;"></p>
                </div>
                <div style="clear:both;"></div>
                
                <div class="player-options" id="server-list">
                    <button class="btn-opt" onclick="iniciarPlayer(1)">▶ ASSISTIR (Servidor 1)</button>
                    <button class="btn-opt" onclick="iniciarPlayer(2)">▶ ASSISTIR (Servidor 2)</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentId = '';
        let currentTipo = '';

        function verDetalhes(tipo, id, titulo, sinopse, img) {
            currentId = id;
            currentTipo = (tipo === 'movie' ? 'movie' : 'tv');

            document.getElementById('m-img').src = img;
            document.getElementById('m-titulo').innerText = titulo;
            document.getElementById('m-sinopse').innerText = sinopse || "Sinopse não disponível.";
            
            // Reseta o modal
            document.getElementById('video-container').style.display = 'none';
            document.getElementById('detalhes-filme').style.display = 'block';
            document.getElementById('videoFrame').src = '';

            document.getElementById('modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function iniciarPlayer(servidor) {
            const container = document.getElementById('video-container');
            const detalhes = document.getElementById('detalhes-filme');
            const iframe = document.getElementById('videoFrame');

            let url = '';
            if(servidor === 1) {
                url = "https://vidsrc.pro/embed/" + currentTipo + "/" + currentId;
            } else {
                url = "https://multiembed.mov/?video_id=" + currentId + "&tmdb=1";
            }

            iframe.src = url;
            detalhes.style.display = 'none'; // Esconde sinopse para focar no vídeo
            container.style.display = 'block'; // Mostra o player
        }

        function fechar() { 
            document.getElementById('videoFrame').src = ''; 
            document.getElementById('modal').style.display = 'none'; 
            document.body.style.overflow = 'auto'; 
        }
    </script>
</body>
</html>
        `);
    } catch (error) {
        res.status(500).send("Erro ao carregar dados. Verifique sua conexão ou a chave da API.");
    }
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
