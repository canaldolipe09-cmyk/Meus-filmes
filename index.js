from flask import Flask, render_template_string, redirect, url_for, request
import sqlite3
import requests

app = Flask(__name__)

# CONFIGURAÇÃO: Coloque sua chave do TMDB abaixo
API_KEY = "bcd24cc5502cb4ceb135115cf749eb50"

def iniciar_banco():
    conn = sqlite3.connect('filmes.db')
    conn.execute('''CREATE TABLE IF NOT EXISTS filmes 
                   (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, id_tmdb TEXT, capa TEXT, tipo TEXT)''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    conn = sqlite3.connect('filmes.db')
    filmes = conn.execute("SELECT * FROM filmes ORDER BY id DESC").fetchall()
    conn.close()
    return render_template_string(HTML_TEMPLATE, filmes=filmes)

@app.route('/importar')
def importar():
    # Busca filmes populares configurados para o Brasil
    url = f"https://api.themoviedb.org/3/trending/movie/day?api_key={API_KEY}&language=pt-BR&region=BR"
    try:
        res = requests.get(url).json().get('results', [])
        conn = sqlite3.connect('filmes.db')
        for item in res:
            id_tmdb = str(item['id'])
            if not conn.execute('SELECT id FROM filmes WHERE id_tmdb = ?', (id_tmdb,)).fetchone():
                titulo = item.get('title')
                capa = f"https://image.tmdb.org/t/p/w500{item.get('poster_path')}"
                conn.execute('INSERT INTO filmes (titulo, id_tmdb, capa, tipo) VALUES (?, ?, ?, ?)', 
                             (titulo, id_tmdb, capa, 'movie'))
        conn.commit()
        conn.close()
    except: pass
    return redirect(url_for('index'))

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxFlix BR</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; padding: 0; text-align: center; }
        .header { background: #111; padding: 20px; border-bottom: 2px solid red; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 15px; }
        .card img { width: 100%; border-radius: 10px; border: 1px solid #333; cursor: pointer; }
        
        /* Estilo do Player */
        #player-screen { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 9999; }
        .btn-voltar { position: absolute; top: 20px; left: 20px; background: red; color: white; border: none; padding: 10px 15px; border-radius: 5px; font-weight: bold; z-index: 10000; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="color: red; margin: 0;">MAXFLIX</h1>
        <a href="/importar" style="color: white; text-decoration: none; background: red; padding: 10px; border-radius: 5px; display: inline-block; margin-top: 10px;">ATUALIZAR LISTA</a>
    </div>

    <div class="grid">
        {% for f in filmes %}
        <div class="card" onclick="abrirPlayer('{{ f[2] }}')">
            <img src="{{ f[3] }}">
            <p style="font-size: 10px; margin-top: 5px;">{{ f[1] }}</p>
        </div>
        {% endfor %}
    </div>

    <div id="player-screen">
        <button class="btn-voltar" onclick="fecharPlayer()">VOLTAR</button>
        <iframe id="ifr-video" allowfullscreen allow="autoplay; encrypted-media"></iframe>
    </div>

    <script>
        function abrirPlayer(id) {
            const ifr = document.getElementById('ifr-video');
            // Usando o servidor que você confirmou que funciona
            ifr.src = `https://vidsrc.pm/embed/movie/${id}?ds_lang=pt`;
            document.getElementById('player-screen').style.display = 'block';
        }
        function fecharPlayer() {
            document.getElementById('player-screen').style.display = 'none';
            document.getElementById('ifr-video').src = '';
        }
    </script>
</body>
</html>
'''

if __name__ == '__main__':
    iniciar_banco()
    app.run(host='0.0.0.0', port=5000)
