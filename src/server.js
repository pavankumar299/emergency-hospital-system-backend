const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./services/socket.service');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

connectDB().then(() => {
  server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
});