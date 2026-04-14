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
    <title>MaxFlix Oficial</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; text-align: center; }
        header { background: #e50914; padding: 20px; font-weight: bold; font-size: 24px; box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3); }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 15px; }
        .card { position: relative; cursor: pointer; }
        .card img { width: 100%; border-radius: 8px; border: 1px solid #222; transition: 0.2s; }
        .card img:active { transform: scale(0.95); opacity: 0.7; }
        .aviso { background: #1a1a1a; color: #ffca28; padding: 10px; font-size: 12px; border-bottom: 1px solid #333; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>
    <div class="aviso">⚠️ DICA: Se abrir anúncio ao clicar no Play, feche-o e clique no Play de novo!</div>
    
    <div class="grid">
        ${filmes.map(f => `
            <div class="card" onclick="irParaFilme('${f.id}')">
                <img src="https://image.tmdb.org/t/p/w300${f.poster_path}">
            </div>
        `).join('')}
    </div>

    <script>
        function irParaFilme(id) {
            // Esse é o player mais estável para o Brasil (WarezCDN)
            const playerUrl = "https://embed.warezcdn.net/movie/" + id;
            
            // Abre o filme diretamente na mesma aba para evitar bloqueio de pop-up
            window.location.href = playerUrl;
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.send("Erro ao carregar catálogo. Tente atualizar.");
    }
});

app.listen(port, '0.0.0.0', () => console.log("Servidor Online"));
