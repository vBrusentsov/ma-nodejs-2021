const controllers = require('./controllers');

module.exports = (req, res) => {
  const { pathname, method } = req;

  // if (pathname === '/' && method === 'GET')
  // return controllers.home(req, res);//

  return controllers.notFound(req, res);
};
