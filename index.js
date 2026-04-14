<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>MAXFLIX - FINAL VERSION</title>
    <style>
        body { background: #000; color: white; font-family: sans-serif; text-align: center; margin: 0; }
        .container { width: 100%; max-width: 900px; margin: auto; padding: 20px; }
        .player { width: 100%; aspect-ratio: 16/9; background: #111; border: 3px solid #e50914; position: relative; }
        iframe { width: 100%; height: 100%; border: none; }
        .btns { margin-top: 20px; display: flex; justify-content: center; gap: 10px; }
        button { padding: 12px; cursor: pointer; background: #e50914; border: none; color: white; font-weight: bold; border-radius: 5px; }
    </style>
</head>
<body>

<div class="container">
    <h1>MAXFLIX</h1>
    <div id="player-area" class="player">
        </div>

    <div class="btns">
        <button onclick="forcarPlayer('URL_DO_SERVIDOR_1')">Servidor 1</button>
        <button onclick="forcarPlayer('URL_DO_SERVIDOR_2')">Servidor 2</button>
        <button onclick="forcarPlayer('URL_DO_SERVIDOR_3')">Servidor 3</button>
    </div>
</div>

<script>
    function forcarPlayer(url) {
        const area = document.getElementById('player-area');
        
        // Remove tudo para limpar o erro de Sandboxing anterior
        area.innerHTML = "";
        
        // Cria um elemento 'object' em vez de 'iframe' se o erro persistir, 
        // mas vamos tentar o iframe com permissões globais primeiro
        const ifrm = document.createElement("iframe");
        
        ifrm.setAttribute("src", url);
        ifrm.setAttribute("allowfullscreen", "true");
        ifrm.setAttribute("referrerpolicy", "no-referrer"); // ESCONDE SEU SITE DO SERVIDOR (Cura o Media Unavailable)
        
        // NÃO COLOQUE O ATRIBUTO SANDBOX AQUI
        // Deixar sem o atributo sandbox dá liberdade total ao player
        
        area.appendChild(ifrm);
    }

    // Tenta carregar o primeiro assim que abrir
    window.onload = () => forcarPlayer('URL_DO_SERVIDOR_1');
</script>

</body>
</html>
