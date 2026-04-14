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
            padding: 15px; 
            font-weight: bold; 
            font-size: 22px; 
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); 
            gap: 10px; 
            padding: 15px; 
        }
        .movie-card { position: relative; }
        .movie-card img { 
            width: 100%; 
            border-radius: 8px; 
            cursor: pointer; 
            transition: transform 0.2s;
            border: 1px solid #333;
        }
        .movie-card img:active { transform: scale(0.95); }
        .movie-title { font-size: 10px; margin-top: 5px; color: #ccc; }
        
        footer { padding: 20px; font-size: 12px; color: #666; text-align: center; }
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

    <footer>Sistema rodando via Render Cloud</footer>

    <script>
        function assistir(id) {
            // O segredo: Abrir o player em uma nova aba para evitar bloqueios do navegador
            const playerUrl = "https://embed.smashystream.com/playere.php?tmdb=" + id;
            
            // Tenta abrir a nova aba
            const novaAba = window.open(playerUrl, '_blank');
            
            if (!novaAba) {
                alert("Por favor, autorize pop-ups para assistir ao filme!");
            }
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.status(500).send("Erro ao conectar com a nuvem. Verifique a API Key.");
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log("Servidor Cloud Ativo!");
});
