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
    <title>MaxFlix Cloud</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; text-align: center; margin: 0; }
        header { background: #e50914; padding: 20px; font-size: 22px; font-weight: bold; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
        img { width: 100%; border-radius: 5px; cursor: pointer; border: 1px solid #333; }
        .footer { margin: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <header>MAXFLIX CLOUD</header>
    <p style="color: #ffca28; font-size: 13px; padding: 10px;">Se não abrir, use VPN ou mude de Wi-Fi.</p>
    
    <div class="grid">
        ${filmes.map(f => `<img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="play('${f.id}')">`).join('')}
    </div>

    <div class="footer">Servidor Render ativo e seguro.</div>

    <script>
        function play(id) {
            // Tentando o servidor mais estável que existe
            const url = "https://vidsrc.to/embed/movie/" + id;
            
            // Abre direto na aba principal para forçar o carregamento
            window.location.href = url;
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.send("Erro na API: " + e.message);
    }
});

app.listen(port, '0.0.0.0', () => console.log("Cloud Online!"));
