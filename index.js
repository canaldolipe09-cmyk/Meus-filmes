<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>MAXFLIX MOBILE</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; overflow: hidden; height: 100vh; display: flex; flex-direction: column; }
        .header { padding: 15px; text-align: center; background: linear-gradient(to bottom, #111, transparent); }
        .logo { color: #e50914; font-size: 24px; font-weight: bold; }
        
        .video-container { flex: 1; background: #000; position: relative; }
        iframe { width: 100%; height: 100%; border: none; }

        .controls { padding: 20px; display: flex; gap: 10px; justify-content: center; background: #111; }
        button { background: #e50914; color: white; border: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; flex: 1; }
        .server-btn { background: #333; }
    </style>
</head>
<body>

    <div class="header"><span class="logo">MAXFLIX</span></div>

    <div class="video-container" id="player">
        </div>

    <div class="controls">
        <button class="server-btn" onclick="load('https://vidsrc.to/embed/movie/550')">S1</button>
        <button class="server-btn" onclick="load('https://www.2embed.cc/embed/550')">S2</button>
        <button onclick="window.location.reload()">Reset</button>
    </div>

    <script>
        function load(url) {
            const container = document.getElementById('player');
            container.innerHTML = `<iframe src="${url}" allowfullscreen referrerpolicy="no-referrer"></iframe>`;
        }
        // Iniciar automático
        window.onload = () => load('https://vidsrc.to/embed/movie/550');
    </script>
</body>
</html>
