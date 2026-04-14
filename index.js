const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 

// Rota principal (Home)
app.get('/', async (req, res) => {
    const query = req.query.search;
    try {
        let conteudoHtml = '';
        
        if (query) {
            // Se o usuário buscou algo
            const busca = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=pt-BR&query=${query}`);
            conteudoHtml = `<h2>🔍 Resultados para: ${query}</h2>
                            <div class="grid">
                                ${busca.data.results.filter(r => r.poster_path).map(r => `
                                    <div class="card" onclick="abrirPlayer('${r.media_type || 'movie'}', '${r.id}')">
                                        <img src="https://image.tmdb.org/t/p/w300${r.poster_path}">
                                        <p>${r.title || r.name}</p>
                                    </div>
                                `).join('')}
                            </div>`;
        } else {
            // Home padrão com as fileiras
            const [filmes, series, animes] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`),
                axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR`),
                axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=16`)
            ]);

            conteudoHtml = `
                <h2>🎬 Filmes Populares</h2>
                <div class="row">${filmes.data.results.map(f => `<div class="card" onclick="abrirPlayer('movie', '${f.id}')"><img src="https://image.tmdb.org/t/p/w300${f.poster_path}"></div>`).join('')}</div>
                <h2>📺 Séries</h2>
                <div class="row">${series.data.
