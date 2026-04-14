<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAXFLIX - Player Final</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
        .main-card { width: 90%; max-width: 800px; text-align: center; background: #111; padding: 40px; border-radius: 15px; border: 1px solid #333; }
        h1 { color: #e50914; font-size: 3rem; margin-bottom: 10px; }
        .player-display { width: 100%; aspect-ratio: 16/9; background: #000; margin-bottom: 20px; border: 2px solid #222; display: flex; align-items: center; justify-content: center; position: relative; }
        iframe { position: absolute; width: 100%; height: 100%; border: none; display: none; }
        .btn-play { background: #e50914; color: white; border: none; padding: 20px 40px; font-size: 1.2rem; font-weight: bold; border-radius: 50px; cursor: pointer; transition: 0.3s; }
        .btn-play:hover { transform: scale(1.1); background: #ff0a16; }
        .server-select { margin-top: 20px; display: flex; gap: 10px; justify-content: center; }
        select { background: #222; color: white; border: 1px solid #444; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>

    <div class="main-card">
        <h1>MAXFLIX</h1>
        <p>Projeto: Conclusão (Servidores & Dublagem)</p>

        <div class="player-display" id="display">
            <button class="btn-play" id="play-trigger" onclick="ativarPlayer()">ASSISTIR AGORA</button>
            <iframe id="video-frame" allowfullscreen referrerpolicy="no-referrer"></iframe>
        </div>

        <div class="server-select">
            <select id="server-list">
                <option value="https://vidsrc.me/embed/movie?tmdb=550">Servidor Global 1 (Recomendado)</option>
                <option value="https://www.2embed.to/embed/tmdb/movie?id=550">Servidor Global 2</option>
                <option value="https://autoembed.to/movie/tmdb/550">Servidor Global 3</option>
            </select>
        </div>
    </div>

    <script>
        function ativarPlayer() {
            const frame = document.getElementById('video-frame');
            const trigger = document.getElementById('play-trigger');
            const server = document.getElementById('server-list').value;

            // Esconde o botão e mostra o iframe
            trigger.style.display = 'none';
            frame.style.display = 'block';

            // Injeta a URL apenas no clique (isso evita o bloqueio automático do navegador)
            frame.src = server;
        }

        // Se o servidor mudar no select, reseta o player
        document.getElementById('server-list').onchange = function() {
            const frame = document.getElementById('video-frame');
            const trigger = document.getElementById('play-trigger');
            frame.src = "";
            frame.style.display = 'none';
            trigger.style.display = 'block';
        };
    </script>
</body>
</html>
