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
    <title>MaxFlix Pro</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; padding: 0; }
        header { background: #e50914; padding: 20px; text-align: center; font-weight: bold; font-size: 22px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; padding: 15px; }
        .movie-card { text-align: center; cursor: pointer; }
        .movie-card img { width: 100%; border-radius: 8px; border: 2px solid #222; }
        .movie-title { font-size: 11px; margin-top: 5px; color: #ccc; }
        .aviso { background: #333; padding: 10px; font-size: 12px; margin: 10px; border-radius: 5px; color: #ffca28; }
    </style>
</head>
<body>
    <header>MAXFLIX CLOUD</header>
    
    <div class="aviso">ℹ️ Dica: O filme abrirá em uma nova aba para evitar bloqueios da operadora.</div>

    <div class="grid">
        ${filmes.map(f => `
            <div class="movie-card" onclick="assistir('${f.id}')">
                <img src="https://image.tmdb.org/t/p/w300${f.poster_path}">
                <div class="movie-title">${f.title}</div>
            </div>
        `).join('')}
    </div>

    <script>
        function assistir(id) {
            // Tentaremos dois servidores diferentes caso um falhe
            const url = "https://vidsrc.me/embed/movie?tmdb=" + id;
            
            // Isso força o navegador a abrir fora do site do Render
            window.location.href = url;
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.status(500).send("Erro ao carregar lista.");
    }
});

app.listen(port, '0.0.0.0', () => console.log("Online"));
