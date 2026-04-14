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
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxFlix 100%</title>
    <style>
        body { background: #000; color: white; font-family: sans-serif; margin: 0; text-align: center; }
        header { background: #e50914; padding: 20px; font-weight: bold; font-size: 22px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 15px; }
        .movie-card { cursor: pointer; transition: 0.3s; }
        .movie-card img { width: 100%; border-radius: 8px; border: 2px solid #222; }
        .movie-card:active { transform: scale(0.9); }
        .info { font-size: 12px; color: #ffca28; padding: 10px; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>
    <div class="info">Dica: Ao clicar, o player abrirá diretamente. Feche os anúncios se aparecerem!</div>
    
    <div class="grid">
        ${filmes.map(f => `
            <div class="movie-card" onclick="assistir('${f.id}')">
                <img src="https://image.tmdb.org/t/p/w300${f.poster_path}">
            </div>
        `).join('')}
    </div>

    <script>
        function assistir(id) {
            // Esse link redireciona direto para o player brasileiro mais estável
            const url = "https://embed.warezcdn.net/movie/" + id;
            window.location.href = url;
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.send("Erro ao carregar lista de filmes.");
    }
});

app.listen(port, '0.0.0.0', () => console.log("Servidor Online"));
