module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Admin connected", socket.id);

    socket.on("join_admin", () => {
      socket.join("admins");
    });
  });
};
