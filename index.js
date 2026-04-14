<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAXFLIX - Player de Vídeo</title>
    <style>
        body { background-color: #000; color: #fff; font-family: Arial, sans-serif; text-align: center; }
        .video-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000; }
        .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
        .server-options { margin-top: 20px; display: flex; justify-content: center; gap: 10px; }
        button { padding: 10px 20px; cursor: pointer; background: #e50914; color: white; border: none; border-radius: 5px; font-weight: bold; }
        button:hover { background: #ff0a16; }
        .error-msg { color: #ffc107; font-size: 0.9em; margin-top: 10px; }
    </style>
</head>
<body>

    <h1>MAXFLIX</h1>

    <div class="video-container">
        <iframe 
            id="main-player"
            src="URL_DO_SERVIDOR_1" 
            allowfullscreen 
            allow="autoplay; encrypted-media"
            sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation">
        </iframe>
    </div>

    <div class="server-options">
        <button onclick="changeServer('URL_DO_SERVIDOR_1')">Servidor 1</button>
        <button onclick="changeServer('URL_DO_SERVIDOR_2')">Servidor 2</button>
        <button onclick="changeServer('URL_DO_SERVIDOR_3')">Servidor 3 (Dublado)</button>
    </div>

    <p class="error-msg">Dica: Se o vídeo não carregar, tente alternar os servidores acima.</p>

    <script>
        function changeServer(url) {
            const player = document.getElementById('main-player');
            
            // Adicionamos um pequeno delay para resetar o frame e evitar o erro de cache do sandbox
            player.src = "about:blank"; 
            
            setTimeout(() => {
                player.src = url;
            }, 100);
        }

        // Lógica para capturar erros de carregamento básicos
        document.getElementById('main-player').onerror = function() {
            alert("Este servidor está instável. Tentando reconectar...");
        };
    </script>

</body>
</html>
