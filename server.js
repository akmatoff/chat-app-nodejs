const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const dotenv = require('dotenv');
const PORT = process.env.PORT || 3000;

dotenv.config();
server.listen(PORT, console.log(`Server running on ${PORT}`));