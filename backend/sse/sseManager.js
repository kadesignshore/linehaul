const clients = new Set();

const addClient = (res) => {
  clients.add(res);

  res.on("close", () => {
    clients.delete(res);
  });
};

const broadcast = (payload) => {
  const data = `data: ${JSON.stringify(payload)}\n\n`;

  clients.forEach((client) => {
    client.write(data);
  });
};

module.exports = {
  addClient,
  broadcast,
};
