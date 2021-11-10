const controllers = require('./controllers');

module.exports = (req, res) => {
  const { pathname, method } = req;

  if (pathname === '/filter' && method === 'GET') {
    return controllers.filterGoods(req, res);
  }

  return controllers.notFound(req, res);
};
