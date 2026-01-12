const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const { driverRoutes, areaRoutes, authRoutes, sseRoutes } = require('./routes');
const path = require('path');
// const { initSockets } = require("./sockets");


dotenv.config();

const app = express();
const PORT = process.env.PORT;



// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:3000','http://localhost:5173','https://linehaul-app.vercel.app'],
  credentials: true,
}));

// Use the auth routes for agent login
app.use('/api/auth', authRoutes);

// Use the sse for updates
app.use("/api/sse", sseRoutes.sseRouter);


// Database connection
connectDB()
  .then(() => {
    const server = require("http").createServer(app);

    // Initialize Socket.IO
    // initSockets(server);

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the process with failure
  });

// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Backend is running smoothly !' });
});

// serve area route
app.use('/api/areas', areaRoutes);

app.use('/api/driver', driverRoutes);

// Global error handler (place this AFTER all routes/middleware)
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({ error: message });
});
