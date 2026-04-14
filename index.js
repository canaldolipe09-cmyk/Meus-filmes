const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`);
        const filmes = response.data.results;

        let html = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxFlix Oficial</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; text-align: center; }
        header { background: #e50914; padding: 15px; font-weight: bold; font-size: 22px; position: sticky; top: 0; z-index: 100; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
        img { width: 100%; border-radius: 8px; cursor: pointer; border: 1px solid #222; }
        
        #player-modal { 
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: #000; z-index: 1000; 
        }
        .nav-player { height: 50px; background: #111; display: flex; align-items: center; padding: 0 15px; border-bottom: 1px solid #e50914; }
        .btn-fechar { background: #e50914; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; font-weight: bold; cursor: pointer; }
        iframe { width: 100%; height: calc(100% - 50px); border: none; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>
    <div class="grid">
        ${filmes.map(f => `<img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="abrirFilme('${f.id}')">`).join('')}
    </div>

    <div id="player-modal">
        <div class="nav-player">
            <button class="btn-fechar" onclick="fecharFilme()">✕ VOLTAR</button>
        </div>
        <iframe id="video-iframe" allowfullscreen></iframe>
    </div>

    <script>
        function abrirFilme(id) {
            const modal = document.getElementById('player-modal');
            const frame = document.getElementById('video-iframe');
            // Servidor mais estável para rodar dentro do site
            frame.src = "https://vidsrc.me/embed/movie?tmdb=" + id;
            modal.style.display = 'block';
        }

        function fecharFilme() {
            const modal = document.getElementById('player-modal');
            const frame = document.getElementById('video-iframe');
            frame.src = ""; 
            modal.style.display = 'none';
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.send("Erro ao carregar lista. Tente atualizar a página.");
    }
});

app.listen(port, () => console.log("Servidor Online"));
