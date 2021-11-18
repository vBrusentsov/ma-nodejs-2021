const http = require('http');
const { config } = require('./config');
const requestHandler = require('./server/requestHandler');

http.createServer(requestHandler).listen(config.PORT, () => {
  console.log(`Server successfully started on port ${config.PORT}`);
});
