const http = require('http');
const app = require('./app');

require('dotenv').config()

var cors = require('cors')
app.use(cors())

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});