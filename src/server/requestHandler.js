const routes = require('./routes');

module.exports = (req, res) => {
  const {
    url,
    headers: { host },
  } = req;

  const { pathname, searchParams } = new URL(url, `https://${host}`);

  let body = [];

  req
    .on('error', (err) => {
      console.error(err);
    })
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      const stringBody = Buffer.concat(body).toString();
      if (req.headers['content-type'] === 'text/csv') {
        return routes(
          { ...req, pathname, body: stringBody, params: searchParams },
          res,
        );
      }
      body = stringBody ? JSON.parse(stringBody) : undefined;
      res.setHeader('Content-Type', 'application/json');
      return routes({ ...req, pathname, body, params: searchParams }, res);
    });
};
