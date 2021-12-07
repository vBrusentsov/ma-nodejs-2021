const http = require('http');
const { config } = require('./config');
const requestHandler = require('./server/requestHandler');

const server = http.createServer(requestHandler);

server.listen(config.PORT, () => {
  console.log(`Server successfully started on port ${config.PORT}`);
});

function start() {
  const port = process.env.PORT;
  const host = process.env.HOST;
  server.listen(port, host, () => {
    console.log(
      `Server started: [${server.address().address}]:${
        server.address().port
      } (${process.env.NODE_ENV})`,
    );
    throw new Error('Oooops');
  });
}

function stop(callback) {
  server.close((error) => {
    if (error) {
      console.error(error, 'Failed to close server!');
      callback();
      return;
    }

    console.log('Server has been stopped.');
    callback();
  });
}

module.exports = {
  start,
  stop,
};
