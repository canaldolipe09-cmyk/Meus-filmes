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
    <title>MaxFlix 2026</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; text-align: center; margin: 0; }
        header { background: #e50914; padding: 20px; font-weight: bold; font-size: 22px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 15px; }
        img { width: 100%; border-radius: 8px; cursor: pointer; border: 1px solid #222; }
        .aviso { background: #222; color: #ffca28; padding: 10px; font-size: 12px; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>
    <div class="aviso">🛡️ Para ver SEM ANÚNCIOS, use o navegador BRAVE no celular.</div>
    
    <div class="grid">
        ${filmes.map(f => `<img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="assistir('${f.id}')">`).join('')}
    </div>

    <script>
        function assistir(id) {
            // Este link é o que mais "aguenta" cliques sem quebrar
            window.location.href = "https://vidsrc.xyz/embed/movie/" + id;
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.send("Erro ao carregar catálogo.");
    }
});

app.listen(port, () => console.log("Online!"));
