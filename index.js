<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAXFLIX - Global Streaming</title>
    <style>
        :root { --primary: #e50914; --bg: #050505; --card: #121212; }
        body { background: var(--bg); color: white; font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; display: flex; flex-direction: column; align-items: center; }
        
        .container { width: 100%; max-width: 1000px; padding: 20px; text-align: center; }
        .logo { color: var(--primary); font-size: 3rem; font-weight: bold; margin-bottom: 20px; text-shadow: 0 0 10px rgba(229, 9, 20, 0.5); }

        /* O segredo para o erro de Sandbox é o container limpo */
        .player-wrapper { 
            width: 100%; 
            aspect-ratio: 16/9; 
            background: #000; 
            border: 2px solid #222; 
            border-radius: 10px; 
            overflow: hidden; 
            box-shadow: 0 10px 50px rgba(0,0,0,0.8);
        }
        iframe { width: 100%; height: 100%; border: none; }

        .server-selector { margin: 30px 0; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        button { 
            background: var(--card); 
            color: #fff; 
            border: 1px solid #333; 
            padding: 15px 25px; 
            border-radius: 5px; 
            cursor: pointer; 
            font-weight: bold; 
            transition: 0.3s; 
        }
        button:hover { border-color: var(--primary); background: #1a1a1a; }
        button.active { background: var(--primary); border-color: var(--primary); box-shadow: 0 0 15px rgba(229, 9, 20, 0.4); }

        .instruction { color: #666; font-size: 0.9rem; margin-top: 15px; }
    </style>
</head>
<body>

    <div class="container">
        <div class="logo">MAXFLIX</div>

        <div class="player-wrapper" id="video-container">
            </div>

        <div class="server-selector">
            <button class="active" onclick="loadVideo(this, 'https://vidsrc.to/embed/movie/550')">SERVIDOR 1 (Gringo)</button>
            <button onclick="loadVideo(this, 'https://www.2embed.cc/embed/550')">SERVIDOR 2 (Gringo)</button>
            <button onclick="loadVideo(this, 'https://vidsrc.me/embed/550')">SERVIDOR 3 (Gringo)</button>
        </div>

        <p class="instruction">Se o vídeo travar, troque o servidor. Servidores gringos podem conter anúncios no primeiro clique.</p>
    </div>

    <script>
        function loadVideo(btn, url) {
            const container = document.getElementById('video-container');
            
            // Estética dos botões
            document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // LIMPEZA TOTAL (Isso resolve o erro de Sandboxing do GitHub)
            container.innerHTML = "";

            // Criação do frame "blindado"
            const frame = document.createElement('iframe');
            frame.src = url;
            frame.setAttribute("allowfullscreen", "true");
            frame.setAttribute("frameborder", "0");
            frame.setAttribute("scrolling", "no");
            
            // Bypasses de segurança
            frame.setAttribute("referrerpolicy", "no-referrer"); 
            frame.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");

            // IMPORTANTE: Não adicionamos o atributo 'sandbox'. 
            // Muitos servidores gringos precisam de scripts para rodar o player de vídeo.
            
            container.appendChild(frame);
        }

        // Inicia o player com o primeiro servidor (Exemplo com ID 550 do TMDB)
        window.onload = () => {
            const firstBtn = document.querySelector('button');
            loadVideo(firstBtn, 'https://vidsrc.to/embed/movie/550');
        };
    </script>
</body>
</html>
