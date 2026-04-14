<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAXFLIX - Conclusão do Projeto</title>
    <style>
        :root { --main-color: #e50914; --bg-color: #080808; }
        body { background-color: var(--bg-color); color: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; display: flex; flex-direction: column; align-items: center; }
        
        header { width: 100%; padding: 20px; text-align: center; background: linear-gradient(to bottom, #141414, transparent); }
        .logo { color: var(--main-color); font-size: 2.5rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }

        .player-container { width: 90%; max-width: 1000px; margin-top: 20px; border: 2px solid #222; border-radius: 8px; overflow: hidden; background: #000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .aspect-ratio { position: relative; padding-bottom: 56.25%; height: 0; }
        .aspect-ratio iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }

        .server-list { margin: 25px 0; display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; }
        .btn-server { background: #222; color: #fff; border: 2px solid #333; padding: 12px 25px; border-radius: 5px; cursor: pointer; transition: 0.3s; font-weight: 600; }
        .btn-server.active { background: var(--main-color); border-color: var(--main-color); }
        .btn-server:hover { background: #333; border-color: var(--main-color); }

        .info-section { width: 90%; max-width: 1000px; text-align: left; margin-bottom: 50px; }
        .status-tag { color: #ffc107; font-size: 0.8rem; background: rgba(255, 193, 7, 0.1); padding: 5px 10px; border-radius: 3px; }
    </style>
</head>
<body>

    <header>
        <div class="logo">MAXFLIX</div>
    </header>

    <div class="player-container">
        <div class="aspect-ratio" id="video-wrapper">
            </div>
    </div>

    <div class="server-list">
        <button class="btn-server active" onclick="changeServer(this, 'URL_DO_SERVIDOR_1')">Servidor 1</button>
        <button class="btn-server" onclick="changeServer(this, 'URL_DO_SERVIDOR_2')">Servidor 2</button>
        <button class="btn-server" onclick="changeServer(this, 'URL_DO_SERVIDOR_3')">Servidor 3 (Dublado)</button>
    </div>

    <div class="info-section">
        <span class="status-tag">PROJETO EM CONCLUSÃO</span>
        <h2 id="movie-title">Carregando filme...</h2>
        <p id="movie-desc">Se o player exibir "Media Unavailable", tente o Servidor 3 ou verifique a conexão com o provedor.</p>
    </div>

    <script>
        // Função para trocar de servidor e limpar erros de Sandboxing
        function changeServer(button, url) {
            const wrapper = document.getElementById('video-wrapper');
            const buttons = document.querySelectorAll('.btn-server');
            
            // Remove classe ativa de todos e adiciona no clicado
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Limpeza total do container para resetar permissões do navegador
            wrapper.innerHTML = "";

            // Criando o novo iframe via JS (Isso burla a maioria dos bloqueios de sandbox)
            const newIframe = document.createElement('iframe');
            newIframe.src = url;
            newIframe.allowFullscreen = true;
            // Adicionamos as permissões necessárias sem a trava do atributo 'sandbox'
            newIframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
            // O no-referrer ajuda a evitar o erro "Media Unavailable"
            newIframe.setAttribute("referrerpolicy", "no-referrer");
            
            wrapper.appendChild(newIframe);
        }

        // Iniciar o projeto com o Servidor 1 ao carregar a página
        window.onload = () => {
            const firstButton = document.querySelector('.btn-server');
            changeServer(firstButton, 'URL_DO_SERVIDOR_1');
        };
    </script>

</body>
</html>
