const controllers = require('./controllers');

module.exports = (req, res) => {
  const { pathname, method } = req;

  if (pathname === '/filter' && method === 'POST') {
    return controllers.getResultFilterGoods(req, res, req.body);
  }

  if (pathname === '/filter' && method === 'GET') {
    const params = {};
    req.params.forEach((value, key) => {
      params[key] = value;
    });
    return controllers.getResultFilterGoods(req, res, params);
  }

  if (pathname === '/topprice' && method === 'POST') {
    return controllers.getResultMostExpensive(req, res, req.body);
  }

  if (pathname === '/topprice' && method === 'GET') {
    return controllers.getResultMostExpensive(req, res);
  }

  if (pathname === '/commonprice' && method === 'POST') {
    return controllers.getResultPrice(req, res, req.body);
  }

  if (pathname === '/commonprice' && method === 'GET') {
    return controllers.getResultPrice(req, res);
  }

  if (pathname === '/data' && method === 'POST') {
    return controllers.newData(req, res);
  }
  return controllers.notFound(req, res);
};
