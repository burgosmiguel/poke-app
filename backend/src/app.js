require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const favoritesRouter = require('./routes/favorites');
const errorHandler = require('./middleware/errorHandler');
const setupSocketHandlers = require('./socket/handlers');
const { initDatabase } = require('./config/database');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// Attach io instance to every request so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/favorites', favoritesRouter);
app.use(errorHandler);

setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initDatabase();
    server.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT}`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

start();
