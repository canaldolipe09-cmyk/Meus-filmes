const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Chave da API TMDB
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
                        <button class="btn-play-hero" onclick="verDetalhes('movie', '${destaque.id}', \`${destaque.title.replace(/"/g, "'")}\`, \`${destaque.overview.replace(/"/g, "'")}\`, 'https://image.tmdb.org/t/p/w500${destaque.poster_path}')">▶ Assistir Agora</button>
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
        .logo { color: var(--red); font-size: 26px; font-weight: bold; text-decoration: none; }
        .search-form input { background: rgba(0,0,0,0.5); border: 1px solid #666; color: white; padding: 6px 12px; border-radius: 4px; outline: none; }
        
        .hero { height: 60vh; background-size: cover; background-position: center; display: flex; align-items: center; padding: 0 4%; }
        .hero-content h1 { font-size: 2.5rem; text-shadow: 2px 2px 4px #000; margin: 0 0 20px 0; }
        .btn-play-hero { background: #fff; border: none; padding: 12px 30px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 1rem; }

        .section-title { margin: 30px 4% 10px; font-size: 1.3rem; border-left: 4px solid var(--red); padding-left: 10px; }
        .row { display: flex; overflow-x: auto; gap: 12px; padding: 0 4% 20px; scrollbar-width: none; }
        .row::-webkit-scrollbar { display: none; }
        .card { min-width: 160px; cursor: pointer; transition: 0.3s; }
        .card:hover { transform: scale(1.08); z-index: 5; }
        .card img { width: 100%; border-radius: 4px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; padding: 90px 4% 20px; }
        
        /* MODAL */
        #modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.98); z-index: 9999; overflow-y: auto; }
        .modal-body { max-width: 900px; margin: 0 auto; padding: 20px; text-align: center; }
        .btn-close { background: var(--red); color: #fff; border: none; padding: 10px 30px; cursor: pointer; border-radius: 4px; font-weight: bold; margin-bottom: 20px; }
        
        /* PLAYER */
        #video-container { width: 100%; aspect-ratio: 16/9; background: #000; margin-top: 10px; display: none; border: 2px solid #222; }
        iframe { width: 100%; height: 100%; border: none; }

        .info-box { display: flex; text-align: left; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
        .info-text { flex: 1; min-width: 300px; }
        .tag-dub { color: #46d369; font-weight: bold; margin-bottom: 10px; display: block; }
        .btn-opt { background: #333; color: #fff; border: 1px solid var(--red); padding: 15px; cursor: pointer; border-radius: 4px; font-weight: bold; width: 100%; margin-top: 10px; transition: 0.2s; }
        .btn-opt:hover { background: var(--red); }
    </style>
</head>
<body>
    <header>
        <a href="/" class="logo">MAXFLIX</a>
        <form action="/" method="GET" class="search-form">
            <input type="text" name="search" placeholder="Buscar filmes/séries...">
        </form>
    </header>

    ${conteudoHtml}

    <div id="modal">
        <div class="modal-body">
            <button class="btn-close" onclick="fechar()">✕ VOLTAR</button>
            
            <div id="video-container">
                <iframe id="videoFrame" allowfullscreen referrerpolicy="no-referrer" sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"></iframe>
            </div>

            <div id="detalhes-UI">
                <div class="info-box">
                    <img id="m-img" style="width:180px; border-radius: 8px; box-shadow: 0 0 15px rgba(0,0,0,0.5);">
                    <div class="info-text">
                        <h1 id="m-titulo" style="margin-top:0;"></h1>
                        <span class="tag-dub">🔊 Áudio: Português (Dublado/Legendado)</span>
                        <p id="m-sinopse" style="color:#bbb; font-size: 0.95rem; line-height: 1.6;"></p>
                        
                        <div id="player-buttons">
                            <button class="btn-opt" onclick="play(1)">▶ ASSISTIR (Servidor Principal)</button>
                            <button class="btn-opt" onclick="play(2)">▶ ASSISTIR (Servidor Reserva)</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let midId = '';
        let midTipo = '';

        function verDetalhes(tipo, id, titulo, sinopse, img) {
            midId = id;
            midTipo = (tipo === 'movie' ? 'movie' : 'tv');

            document.getElementById('m-img').src = img;
            document.getElementById('m-titulo').innerText = titulo;
            document.getElementById('m-sinopse').innerText = sinopse || "Sinopse não disponível no momento.";
            
            // Reseta visual
            document.getElementById('video-container').style.display = 'none';
            document.getElementById('detalhes-UI').style.display = 'block';
            document.getElementById('videoFrame').src = '';

            document.getElementById('modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function play(srv) {
            const container = document.getElementById('video-container');
            const detalhes = document.getElementById('detalhes-UI');
            const iframe = document.getElementById('videoFrame');

            let url = '';
            if(srv === 1) {
                // Servidor WarezCDN (Específico para conteúdo dublado/PT-BR)
                const cat = (midTipo === 'movie' ? 'filme' : 'serie');
                url = "https://embed.warezcdn.com/" + cat + "/" + midId;
            } else {
                // Servidor SuperEmbed (Global)
                url = "https://multiembed.mov/?video_id=" + midId + "&tmdb=1";
            }

            iframe.src = url;
            detalhes.style.display = 'none'; 
            container.style.display = 'block'; 
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
        res.status(500).send("Erro ao carregar dados da API. Verifique sua chave.");
    }
});

app.listen(port, () => console.log('Site Online: http://localhost:' + port));
