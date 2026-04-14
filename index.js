const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000;

// Chave da API do TMDB
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
    <title>MaxFlix Pro - Cloud</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; padding: 0; }
        header { 
            background: linear-gradient(to bottom, #e50914, #b20710); 
            padding: 20px; 
            font-weight: bold; 
            font-size: 24px; 
            text-align: center;
            letter-spacing: 2px;
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); 
            gap: 15px; 
            padding: 20px; 
        }
        .movie-card { text-align: center; cursor: pointer; }
        .movie-card img { 
            width: 100%; 
            border-radius: 10px; 
            transition: transform 0.3s;
            border: 2px solid #222;
        }
        .movie-card img:hover { transform: scale(1.05); border-color: #e50914; }
        .movie-title { font-size: 11px; margin-top: 8px; color: #fff; font-weight: bold; }
        
        footer { padding: 30px; font-size: 12px; color: #444; text-align: center; }
    </style>
</head>
<body>
    <header>MAXFLIX CLOUD</header>
    
    <div class="grid">
        ${filmes.map(f => `
            <div class="movie-card" onclick="assistir('${f.id}')">
                <img src="https://image.tmdb.org/t/p/w300${f.poster_path}">
                <div class="movie-title">${f.title}</div>
            </div>
        `).join('')}
    </div>

    <footer>Conectado ao Servidor Render Pro</footer>

    <script>
        function assistir(id) {
            // USANDO O VIDSRC - O MELHOR SERVER ATUAL
            const playerUrl = "https://vidsrc.to/embed/movie/" + id;
            
            // Abrir em nova aba para não ser bloqueado pelo navegador
            const win = window.open(playerUrl, '_blank');
            if (win) {
                win.focus();
            } else {
                alert('Por favor, permita pop-ups para abrir o filme!');
            }
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.status(500).send("Erro na Cloud: Verifique sua API Key.");
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log("Servidor Cloud Online!");
});
