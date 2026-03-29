const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const listingsRouter = require('./controllers/listings');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/listings', listingsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
