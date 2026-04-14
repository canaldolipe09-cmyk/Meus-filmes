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
    <title>MaxFlix</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; text-align: center; margin: 0; }
        header { background: #e50914; padding: 15px; font-weight: bold; font-size: 20px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
        img { width: 100%; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <header>MAXFLIX</header>
    <div class="grid">
        ${filmes.map(f => `<img src="https://image.tmdb.org/t/p/w300${f.poster_path}" onclick="assistir('${f.id}')">`).join('')}
    </div>
    <script>
        function assistir(id) {
            // Esse link é o que menos dá erro
            window.location.href = "https://embed.warezcdn.net/movie/" + id;
        }
    </script>
</body>
</html>`;
        res.send(html);
    } catch (e) {
        res.send("Erro ao carregar. Tente atualizar a página.");
    }
});

app.listen(port, () => console.log("Rodando!"));
