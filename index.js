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
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxFlix Oficial</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; text-align: center; margin: 0; }
        header { background: #e50914; padding: 20px; font-weight: bold; font-size: 22px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
        img { width: 100%; border-radius: 8px; cursor: pointer; border: 1px solid #222; }
        .footer { padding: 20px; font-size: 12px; color: #555; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>
    <div style="background: #222; padding: 10px; font-size: 13px; color: #ffca28;">
        ✅ DICA: Se a tela ficar branca, ligue o 4G/5G ou use uma VPN.
    </div>
    
    <div class="grid">
        ${filmes.map(f => `<img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="assistir('${f.id}')">`).join('')}
    </div>

    <div class="footer">Servidor Render Online</div>

    <script>
        function assistir(id) {
            // Este link usa o ID do TMDB diretamente no player mais compatível hoje
            const playerUrl = "https://vidsrc.xyz/embed/movie/" + id;
            window.location.href = playerUrl;
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.send("Erro: Verifique a conexão.");
    }
});

app.listen(port, () => console.log("Site no ar!"));
