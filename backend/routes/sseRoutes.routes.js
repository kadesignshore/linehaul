// routes/sseRoutes.routes.js
const express = require("express");
const router = express.Router();

let clients = [];

router.get("/subscribe", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const clientId = Date.now();
  clients.push({ id: clientId, res });

  req.on("close", () => {
    clients = clients.filter(c => c.id !== clientId);
  });
});

const sendUpdate = (data) => {
  clients.forEach(c =>
    c.res.write(`data: ${JSON.stringify(data)}\n\n`)
  );
};

module.exports = {
  sseRouter: router,
  sendUpdate,
};
