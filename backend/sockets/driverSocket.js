module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New driver connected", socket.id);

    socket.on("update_status", ({ entryId, status }) => {
      // Broadcast only to admins
      io.to("admins").emit("ENTRY_STATUS_UPDATED", { entryId, status });
    });
  });
};
