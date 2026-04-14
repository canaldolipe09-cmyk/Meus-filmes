const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 

app.get('/', async (req, res) => {
    const query = req.query.search;
    try {
        const [filmes, series, animes] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`),
            axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR`),
            axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=16`)
        ]);

        // Escolhe um filme aleatório para o Banner de Destaque
        const destaque = filmes.data.results[Math.floor(Math.random() * filmes.data.results.length)];

        let conteudoHtml = '';
        if (query) {
            const busca = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=pt-BR&query=${query}`);
            conteudoHtml = `
                <h2 class="section-title">Resultados para: ${query}</h2>
                <div class="grid">
                    ${busca.data.results.filter(r => r.poster_path).map(r => `
                        <div class="card" onclick="verDetalhes('${r.media_type || 'movie'}', '${r.id}', \`${(r.title || r.name).replace(/"/g, "'")}\`, \`${(r.overview || '').replace(/"/g, "'")}\`, '${r.vote_average}', 'https://image.tmdb.org/t/p/w500${r.poster_path}')">
                            <img src="https://image.tmdb.org/t/p/w300${r.poster_path}">
                        </div>
                    `).join('')}
                </div>`;
        } else {
            conteudoHtml = `
                <div class="hero" style="background-image: linear-gradient(to top, var(--dark-bg), transparent), url('https://image.tmdb.org/t/p/original${destaque.backdrop_path}')">
                    <div class="hero-content">
                        <h1>${destaque.title}</h1>
                        <p>${destaque.overview.substring(0, 150)}...</p>
                        <button class="btn-play-hero" onclick="verDetalhes('movie', '${destaque.id}', \`${destaque.title.replace(/"/g, "'")}\`, \`${destaque.overview.replace(/"/g, "'")}\`, '${destaque.vote_average}', 'https://image.tmdb.org/t/p/w500${destaque.poster_path}')">▶ Assistir</button>
                    </div>
                </div>
                <h2 class="section-title">Filmes Populares</h2>
                <div class="row">${filmes.data.results.map(f => `<div class="card" onclick="verDetalhes('movie', '${f.id}', \`${f.title.replace(/"/g, "'")}\`, \`${f.overview.replace(/"/g, "'")}\`, '${f.vote_average}', 'https://image.tmdb.org/t/p/w500${f.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}"></div>`).join('')}</div>
                <h2 class="section-title">Séries</h2>
                <div class="row">${series.data.results.map(s => `<div class="card" onclick="verDetalhes('tv', '${s.id}', \`${s.name.replace(/"/g, "'")}\`, \`${s.overview.replace(/"/g, "'")}\`, '${s.vote_average}', 'https://image.tmdb.org/t/p/w500${s.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${s.poster_path}"></div>`).join('')}</div>
                <h2 class="section-title">Animes</h2>
                <div class="row">${animes.data.results.map(a => `<div class="card" onclick="verDetalhes('tv', '${a.id}', \`${a.name.replace(/"/g, "'")}\`, \`${a.overview.replace(/"/g, "'")}\`, '${a.vote_average}', 'https://image.tmdb.org/t/p/w500${a.poster_path}')"><img src="https://image.tmdb.org/t/p/w300${a.poster_path}"></div>`).join('')}</div>
            `;
        }

        res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAXFLIX</title>
    <style>
