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
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; text-align: center; overflow-x: hidden; }
        header { background: #e50914; padding: 15px; font-weight: bold; font-size: 20px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
        img { width: 100%; border-radius: 5px; cursor: pointer; border: 1px solid #222; }
        
        /* Janela do Player dentro do seu site */
        #player-overlay { 
            display: none; 
            position: fixed; 
            top: 0; left: 0; 
            width: 100%; height: 100%; 
            background: #000; 
            z-index: 999; 
        }
        .controls { height: 50px; background: #111; display: flex; align-items: center; padding: 0 15px; }
        .btn-fechar { background: #e50914; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; font-weight: bold; cursor: pointer; }
        
        /* O Iframe com filtro anti-anúncio */
        iframe { 
            width: 100%; 
            height: calc(100% - 50px); 
            border: none; 
        }
    </style>
</head>
<body>
    <header>MAXFLIX</header>
    
    <div class="grid">
        ${filmes.map(f => `<img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="abrirPlayer('${f.id}')">`).join('')}
    </div>

    <div id="player-overlay">
        <div class="controls">
            <button class="btn-fechar" onclick="fecharPlayer()">✕ VOLTAR</button>
            <span style="margin-left: 15px; font-size: 12px; color: #aaa;">Carregando filme...</span>
        </div>
        <iframe id="video-frame" 
                allowfullscreen 
                sandbox="allow-forms allow-scripts allow-same-origin allow-presentation">
        </iframe>
    </div>

    <script>
        function abrirPlayer(id) {
            const overlay = document.getElementById('player-overlay');
            const frame = document.getElementById('video-frame');
            
            // Usando o player SuperEmbed que funciona melhor dentro de sites
            frame.src = "https://www.superembed.stream/movie/" + id;
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden'; // trava a rolagem do fundo
        }

        function fecharPlayer() {
            const overlay = document.getElementById('player-overlay');
            const frame = document.getElementById('video-frame');
            
            frame.src = ""; // para o som do filme
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto'; // libera a rolagem
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.send("Erro ao carregar lista.");
    }
});

app.listen(port, () => console.log("Servidor Online"));
