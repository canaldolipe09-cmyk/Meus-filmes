const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Sua chave da API TMDB
const API_KEY = 'bcd24cc5502cb4ceb135115cf749eb50'; 

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`);
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
        header { 
            background: linear-gradient(to bottom, #e50914, #b20710); 
            padding: 20px; 
            font-weight: bold; 
            font-size: 24px; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 12px; 
            padding: 15px; 
        }
        .movie-card { cursor: pointer; border: 1px solid #222; border-radius: 8px; overflow: hidden; }
        .movie-card img { width: 100%; display: block; transition: 0.3s; }
        .movie-card img:active { opacity: 0.6; transform: scale(0.95); }
        .dica { 
            background: #1a1a1a; 
            color: #ffca28; 
            padding: 10px;
