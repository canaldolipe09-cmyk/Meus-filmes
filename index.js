<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAXFLIX - Solução de Erros</title>
    <style>
        body { background: #0b0b0b; color: #fff; font-family: sans-serif; margin: 0; padding: 20px; }
        .player-wrapper { max-width: 900px; margin: auto; }
        .frame-container { position: relative; padding-bottom: 56.25%; height: 0; background: #000; border: 2px solid #333; }
        .frame-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
        .controls { margin-top: 15px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        button { background: #e50914; color: #fff; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; }
        button:hover { background: #b20710; }
        .status { margin-top: 10px; color: #aaa; font-size: 14px; }
    </style>
</head>
<body>

<div class="player-wrapper">
    <h1>MAXFLIX</h1>
    
    <div class="frame-container" id="container">
        <iframe 
            id="video-player"
            src="URL_DO_SERVIDOR_1" 
            allowfullscreen="true" 
            webkitallowfullscreen="true" 
            mozallowfullscreen="true"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerpolicy="no-referrer">
        </iframe>
    </div>

    <div class="controls">
        <button onclick="loadPlayer('URL_DO_SERVIDOR_1')">Servidor 1</button>
        <button onclick="loadPlayer('URL_DO_SERVIDOR_2')">Servidor 2</button>
        <button onclick="loadPlayer('URL_DO_SERVIDOR_3')">Servidor 3</button>
    </div>
    
    <p class="status" id="msg">Tentando carregar Servidor 1...</p>
</div>

<script>
function loadPlayer(url) {
    const container = document.getElementById('container');
    const msg = document.getElementById('msg');
    
    msg.innerText = "Alternando servidor... aguarde.";
    
    // Força a destruição e recriação do iframe para limpar erros de Sandbox do navegador
    container.innerHTML = `
        <iframe 
            id="video-player"
            src="${url}" 
            allowfullscreen="true" 
            webkitallowfullscreen="true" 
            mozallowfullscreen="true"
            allow="autoplay; encrypted-media"
            referrerpolicy="no-referrer">
        </iframe>
    `;
}
</script>

</body>
</html>
