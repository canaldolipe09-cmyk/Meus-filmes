<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAXFLIX - Global Servers</title>
    <style>
        :root { --accent: #e50914; --bg: #0a0a0a; }
        body { background: var(--bg); color: white; font-family: 'Arial', sans-serif; margin: 0; text-align: center; }
        .container { padding: 20px; max-width: 1000px; margin: auto; }
        .player-box { width: 100%; aspect-ratio: 16/9; background: #000; border: 1px solid #333; position: relative; border-radius: 8px; box-shadow: 0 0 30px rgba(229, 9, 20, 0.15); }
        iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px; }
        .server-nav { margin: 20px 0; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        button { background: #1f1f1f; color: #ccc; border: 1px solid #444; padding: 12px 20px; cursor: pointer; border-radius: 4px; font-weight: bold; transition: 0.2s; }
        button:hover { border-color: var(--accent); color: white; }
        button.active { background: var(--accent); color: white; border-color: var(--accent); }
        .status { font-size: 13px; color: #666; margin-top: 10px; }
    </style>
</head>
<body>

    <div class="container">
        <h1 style="color: var(--accent); font-size: 2.5em;">MAXFLIX</h1>
        
        <div class="player-box" id="main-container">
            </div>

        <div class="server-nav">
            <button class="active" onclick="changeS(this, 'https://vidsrc.me/embed/movie?tmdb=ID_DO_FILME')">Server 1 (Global)</button>
            <button onclick="changeS(this, 'https://www.2embed.to/embed/tmdb/movie?id=ID_DO_FILME')">Server 2 (Fast)</button>
            <button onclick="changeS(this, 'https://autoembed.to/movie/tmdb/ID_DO_FILME')">Server 3 (Multi-Sub)</button>
        </div>

        <p class="status">Dica: Servidores globais podem levar até 10s para carregar o buffer inicial.</p>
    </div>

    <script>
        function changeS(btn, url) {
            // Substitua 'ID_DO_FILME' pelo ID real do TMDB que você quer testar
            // Exemplo: '550' para Clube da Luta
            const finalUrl = url.replace('ID_DO_FILME', '550'); 

            const container = document.getElementById('main-container');
            
            // Limpa botões
            document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Limpeza total do container para evitar o erro de Sandboxing persistente do GitHub
            container.innerHTML = "";

            const ifrm = document.createElement("iframe");
            ifrm.setAttribute("src", finalUrl);
            ifrm.setAttribute("allowfullscreen", "true");
            ifrm.setAttribute("referrerpolicy", "no-referrer"); // ESSENCIAL PARA O GITHUB PAGES
            ifrm.setAttribute("allow", "autoplay; encrypted-media");
            
            // NÃO usamos o atributo 'sandbox' aqui. Deixamos o navegador decidir.
            
            container.appendChild(ifrm);
        }

        // Auto-load inicial
        window.onload = () => {
            const btn = document.querySelector('button');
            changeS(btn, btn.getAttribute('onclick').split("'")[3]);
        };
    </script>

</body>
</html>
