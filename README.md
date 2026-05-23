# PokeApp

Full-stack application to browse and manage favourite Pokémon, built with **Node.js/Express**, **React 18**, **PostgreSQL**, and **Socket.IO**.

---

## Technical decisions

| Concern | Choice | Reason |
|---|---|---|
| Backend framework | Express | Required by spec |
| Frontend framework | React 18 | Component-based UI, large ecosystem |
| State management | Zustand | Lightweight, works outside React components (needed for socket handlers) |
| Real-time | Socket.IO | Required by spec |
| Database | PostgreSQL 16 | Required by spec |
| HTTP client | Axios | Mature, interceptor support for `X-Username` / `X-Socket-Id` headers |
| Frontend build | Vite + @vitejs/plugin-react | Fast DX, first-class React/JSX support |
| Frontend serve | Nginx | Lightweight static server for production image |

---

## Prerequisites

- **Docker** ≥ 20.10
- **Docker Compose** ≥ 2.0 (`docker compose` or `docker-compose`)

---

## Installation and setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd poke-app

# 2. (Optional) copy and adjust environment variables
cp .env.example .env

# 3. Start everything
docker-compose up --build
```

Wait for the `backend` service to print `[Server] Running on port 3000` before using the app.

---

## Service ports

| Service | Internal port | Exposed port |
|---|---|---|
| Frontend (Nginx) | 80 | **8080** |
| Backend (Express) | 3000 | **3000** |
| PostgreSQL | 5432 | not exposed |

Open the app at **http://localhost:8080**.

---

## How to test the real-time feature

1. Open **two browser tabs** at `http://localhost:8080`.
2. In the first tab, set a trainer name in the top-right field (e.g. *"Ash"*).
3. In the second tab, set a different trainer name (e.g. *"Misty"*).
4. In the first tab, click any Pokémon card and press **"Add to Favorites"** (or click the ★ icon directly on the card).
5. **The second tab** will instantly show a toast notification like *"Ash added bulbasaur to favorites!"* — without any page refresh.
6. Any note update or removal also propagates in real time.

> Each browser tab gets a unique socket ID (`socket.id`). The frontend sends this ID as the `X-Socket-Id` header; the backend echoes it back in every socket event as `initiatorId`. Tabs skip events where `initiatorId === socket.id` (they already updated optimistically), while all other tabs apply the update immediately.

> Socket events emitted: `favorite:added`, `favorite:removed`, `favorite:updated`

---

## Backend API endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/favorites` | List favourites for the current user |
| `POST` | `/api/favorites` | Add a Pokémon to favourites |
| `PATCH` | `/api/favorites/:pokemonId/note` | Update note for a favourite |
| `DELETE` | `/api/favorites/:pokemonId` | Remove a favourite |

All requests must include the header `X-Username: <name>` (defaults to `"trainer"` if omitted). The frontend sends this automatically from the value entered in the top-right input.

### POST /api/favorites — request body

```json
{
  "pokemon_id": 1,
  "pokemon_name": "bulbasaur",
  "pokemon_image": "https://...",
  "pokemon_types": ["grass", "poison"]
}
```

### PATCH /api/favorites/:pokemonId/note — request body

```json
{ "note": "My first Pokémon!" }
```

---

## Running tests

```bash
cd backend
npm test
```

10 unit tests covering the favorites service layer (add, list, update note, remove — including error cases like missing fields, duplicate entries, and not-found).

---

## AI tools used

This project was developed with the assistance of:

- **[Claude Code](https://claude.ai/code)** — agentic coding assistant by Anthropic, used for architecture decisions, code generation, and debugging.
- **[GitHub Copilot](https://github.com/features/copilot)** — AI pair programmer, used for inline completions and boilerplate acceleration.

---

## Development (without Docker)

```bash
# Backend
cd backend
cp ../.env.example .env   # adjust DB_HOST=localhost
npm install
npm run dev               # nodemon on :3000

# Frontend
cd frontend
npm install
npm run dev               # Vite dev server on :5173 (proxies /api and /socket.io → :3000)
```

You also need a local PostgreSQL instance matching the credentials in `.env`.
