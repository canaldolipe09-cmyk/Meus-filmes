<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAXFLIX - Sistema de Player</title>
    <style>
        body { background: #050505; color: white; font-family: 'Segoe UI', sans-serif; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
        .wrapper { width: 95%; max-width: 900px; }
        .player-area { position: relative; width: 100%; padding-bottom: 56.25%; background: #000; border: 2px solid #e50914; border-radius: 8px; box-shadow: 0 0 20px rgba(229, 9, 20, 0.2); }
        .player-area iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 6px; }
        .controls { margin-top: 20px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        button { background: #1a1a1a; color: white; border: 1px solid #333; padding: 12px 20px; cursor: pointer; border-radius: 5px; font-weight: bold; transition: 0.3s; }
        button.active { background: #e50914; border-color: #e50914; }
        .warning { color: #888; font-size: 12px; margin-top: 15px; }
    </style>
</head>
<body>

    <div class="wrapper">
        <h1 style="color: #e50914; letter-spacing: 2px;">MAXFLIX</h1>
        
        <div class="player-area" id="player-container">
            </div>

        <div class="controls">
            <button onclick="carregarServer(this, 'URL_AQUI_1')">SERVIDOR 1</button>
            <button onclick="carregarServer(this, 'URL_AQUI_2')">SERVIDOR 2</button>
            <button onclick="carregarServer(this, 'URL_AQUI_3')">SERVIDOR 3</button>
        </div>

        <p class="warning">Dica: Se aparecer 'Sandboxing', limpe o cache do navegador (Ctrl+F5).</p>
    </div>

    <script>
        function carregarServer(btn, url) {
            const container = document.getElementById('player-container');
            
            // 1. Destaca o botão selecionado
            document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Limpa o container (IMPORTANTE para matar o erro de sandbox anterior)
            container.innerHTML = "";

            // 3. Cria o iframe com política de "No-Referrer"
            // Isso engana o servidor de vídeo, fazendo-o não ver que o pedido vem do GitHub
            const frame = document.createElement('iframe');
            frame.setAttribute("src", url);
            frame.setAttribute("allowfullscreen", "true");
            frame.setAttribute("scrolling", "no");
            frame.setAttribute("referrerpolicy", "no-referrer"); // SOLUÇÃO PARA MEDIA UNAVAILABLE
            frame.setAttribute("allow", "autoplay; encrypted-media");
            
            // NOTA: Não adicionamos o atributo 'sandbox' para dar permissão total ao player
            
            container.appendChild(frame);
        }

        // Inicia com o primeiro servidor
        window.onload = () => {
            const primeiroBtn = document.querySelector('button');
            carregarServer(primeiroBtn, 'URL_AQUI_1');
        };
    </script>
</body>
</html>
