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

  return controllers.notFound(req, res);
};
