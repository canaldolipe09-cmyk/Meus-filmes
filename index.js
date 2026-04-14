const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 
const agent = new https.Agent({ rejectUnauthorized: false });

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
            params: { api_key: API_KEY, language: 'pt-BR' },
            httpsAgent: agent
        });
        const filmes = response.data.results;

        let html = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxFlix Cloud</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; text-align: center; }
        header { background: #e50914; padding: 20px; font-weight: bold; font-size: 22px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; padding: 15px; }
        .card { cursor: pointer; border: 1px solid #222; border-radius: 8px; overflow: hidden; background: #111; }
        .card img { width: 100%; display: block; }
        .title { font-size: 10px; padding: 5px; height: 30px; overflow: hidden; }
        #menu-player { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.9); z-index:99; flex-direction: column; align-items: center; justify-content: center; }
        .btn-play { background: #e50914; color: #fff; border: none; padding: 15px; margin: 10px; width: 80%; border-radius: 5px; font-weight: bold; }
        .btn-voltar { background: #444; color: #fff; border: none; padding: 10px; margin-top: 20px; width: 50%; }
    </style>
</head>
<body>
    <header>MAXFLIX CLOUD</header>
    <p style="font-size: 12px; color: #aaa;">Se o player não abrir, tente outra opção ou use uma VPN.</p>
    
    <div class="grid">
        ${filmes.map(f => `
            <div class="card" onclick="mostrarOpcoes('${f.id}')">
                <img src="https://image.tmdb.org/t/p/w300${f.poster_path}">
                <div class="title">${f.title}</div>
            </div>
        `).join('')}
    </div>

    <div id="menu-player">
        <h3>Escolha um Servidor:</h3>
        <button class="btn-play" onclick="ir('https://vidsrc.to/embed/movie/', 1)">Opção 1 (Vidsrc)</button>
        <button class="btn-play" onclick="ir('https://embed.smashystream.com/playere.php?tmdb=', 2)">Opção 2 (Smashy)</button>
        <button class="btn-play" onclick="ir('https://multiembed.eu/?video_id=', 3)">Opção 3 (Multi)</button>
        <button class="btn-play" onclick="ir('https://vidsrc.me/embed/movie?tmdb=', 1)">Opção 4 (Me)</button>
        <button class="btn-voltar" onclick="fechar()">✕ CANCELAR</button>
    </div>

    <script>
        let idAtual = "";
        function mostrarOpcoes(id) {
            idAtual = id;
            document.getElementById('menu-player').style.display = 'flex';
        }
        function fechar() {
            document.getElementById('menu-player').style.display = 'none';
        }
        function ir(base, tipo) {
            let url = base + idAtual;
            if(tipo === 3) url = base + idAtual + "&tmdb=1";
            window.location.href = url;
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.send("Erro ao carregar lista.");
    }
});

app.listen(port, '0.0.0.0', () => console.log("Cloud Online"));
