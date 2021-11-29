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
    return controllers.getResultMostExpensive(req, res);
  }

  if (pathname === '/topprice' && method === 'GET') {
    return controllers.getResultMostExpensive(req, res);
  }

  if (pathname === '/commonprice' && method === 'POST') {
    return controllers.getResultPrice(req, res);
  }

  if (pathname === '/commonprice' && method === 'GET') {
    return controllers.getResultPrice(req, res);
  }
  if (pathname === '/discount/promise' && method === 'POST') {
    return controllers.getPromiseDiscount(req, res);
  }

  if (pathname === '/discount/promise' && method === 'GET') {
    return controllers.getPromiseDiscount(req, res);
  }
  if (pathname === '/discount/promisify' && method === 'POST') {
    return controllers.getPromisifyDiscountPrice(req, res);
  }

  if (pathname === '/discount/promisify' && method === 'GET') {
    return controllers.getPromisifyDiscountPrice(req, res);
  }

  if (pathname === '/discount/async' && method === 'POST') {
    return controllers.getAsyncDiscountPrice(req, res);
  }

  if (pathname === '/discount/async' && method === 'GET') {
    return controllers.getAsyncDiscountPrice(req, res);
  }
  if (pathname === '/data' && method === 'POST') {
    return controllers.newData(req, res);
  }
  return controllers.notFound(req, res);
};
