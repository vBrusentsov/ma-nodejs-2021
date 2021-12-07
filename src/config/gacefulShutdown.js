const server = require('../index');

function gracefulShutdown() {
  const exitHandler = (error) => {
    if (error) {
      console.error(error);
    }

    console.log('Gracefully stopping...');
    server.stop(() => {
      process.exit();
    });
  };

  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);

  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);

  process.on('uncaughtException', exitHandler);
  process.on('unhandledRejection', exitHandler);
}

function boot() {
  gracefulShutdown();
  server.start();
}

boot();
