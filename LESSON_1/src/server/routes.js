const controllers = require('./controllers');

module.exports = (req, res) => {
  const { pathname, method } = req;

  if (pathname === '/filter' && method === 'POST') {
    return controllers.getReqfilterGoods(req, res, req.body);
  }

  if (pathname === '/filter' && method === 'GET') {
    const params = {};
    req.params.forEach((value, key) => {
      params[key] = value;
    });
    return controllers.getReqfilterGoods(req, res, params);
  }

  if (pathname === '/topprice' && method === 'POST') {
    return controllers.getResultMostExpensive(req, res, req.body);
  }

  if (pathname === '/topprice' && method === 'GET') {
    return controllers.getResultMostExpensive(req, res);
  }

  return controllers.notFound(req, res);
};
