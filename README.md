
# Gridline — Flask Tic Tac Toe

A responsive, two-player Tic Tac Toe game. Flask serves the web application; the game state and interactions run in the browser.

## Project structure

```text
flask-tic-tac-toe/
├── app.py
├── requirements.txt
├── Dockerfile
├── .dockerignore
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── game.js
```

## Run locally

Requires Python 3.10+.

```bash
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open http://localhost:5000.

For local development, `python app.py` starts Flask's built-in server. It is not intended for production deployment.

## Build and run with Docker

Run these commands from the project directory:

```bash
docker build -t gridline-tictactoe:v1 .

docker run -d \
  --name gridline-game \
  -p 5000:5000 \
  gridline-tictactoe:v1
```

Open http://localhost:5000.

Useful commands:

```bash
docker ps
docker logs -f gridline-game
docker inspect --format='{{.State.Health.Status}}' gridline-game
docker stop gridline-game
docker rm gridline-game
```

## How it works

- `app.py`: Flask route serves the main HTML page; `/health` is used by Docker's health check.
- `templates/index.html`: page structure and game board.
- `static/style.css`: responsive layout and visual styling.
- `static/avizacademy-logo.png`: Aviz Academy branding displayed in the page header.
- `static/game.js`: turn management, win/draw detection, scoreboard and reset actions.
- `Dockerfile`: installs dependencies, copies application files, switches to a non-root user and starts Gunicorn.

## Learning notes

- `FROM`: selects the Python base image.
- `WORKDIR`: sets `/app` as the working directory.
- `COPY`: copies requirements and application files into the image.
- `RUN`: installs Python packages and creates the application user at build time.
- `ENV`: configures Python runtime behavior.
- `USER`: runs the app as an unprivileged user.
- `EXPOSE`: documents the container port; it does not publish the port on the host.
- `HEALTHCHECK`: checks the Flask health endpoint from inside the container.
- `CMD`: starts Gunicorn when the container starts.

The scoreboard is held in browser JavaScript memory. It is not persisted to a database and resets when the page is refreshed. The game is intended for two people sharing one browser/device, not network multiplayer.
