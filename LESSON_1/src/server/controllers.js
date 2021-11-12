const services = require('../services');

const getBody = {};
const data = require('../data.json');
const {
  helper1: getFilterGoods,
  // helper2: getMostExpensive,
  // helper3: getPrice,
} = require('../services/helpers');

function getReqfilterGoods(req, res, params) {
  const { goods, code, codeNoContent, messageNoContent } = services.filter();

  if (Array.from(req.params).length === 0) {
    res.statusCode = code;
    res.write(JSON.stringify(goods));
    res.end();
  } else {
    let resultGoods = goods;
    req.params.forEach((value, key) => {
      resultGoods = getFilterGoods(
        resultGoods,
        key,
        Number.isNaN(+value) ? value : +value,
      );
    });
    if (resultGoods.length === 0) {
      res.statusCode = codeNoContent;
      res.end(JSON.stringify({ messageNoContent }));
    } else {
      res.write(JSON.stringify(resultGoods));
      res.statusCode = code;
      res.end();
    }
  }
}

// function mostExpensive(req, res) {
//   const { message, code } = services.mostExpensive();
//   res.write(message);
//   res.statusCode = code;
//   res.end();
// }

// function price(req, res) {
//   const { message, code } = services.price();
//   res.write(message);
//   res.statusCode = code;
//   res.end();
// }

// function goods(req, res) {
//   const code = 200;
//   res.write(data);
//   res.statusCode = code;
//   res.end();
// }

function notFound(req, res) {
  const { message, code } = services.notFound();
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

module.exports = {
  getReqfilterGoods,
  // mostExpensive,
  // price,
  // goods,
  notFound,
};
