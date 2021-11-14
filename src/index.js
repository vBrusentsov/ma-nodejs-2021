const http = require('http');

const requestHandler = require('./server/requestHandler');

const PORT = 3000;

http.createServer(requestHandler).listen(PORT, () => {
  console.log(`Serever successfully started on port ${PORT}`);
});
