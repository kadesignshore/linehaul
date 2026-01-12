let io;

function initSockets(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: { origin: "*" },
  });

  // Load socket modules
  require("./driverSocket")(io);
  require("./adminSocket")(io);
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

module.exports = { initSockets, getIO };
