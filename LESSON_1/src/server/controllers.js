const services = require('../services');

const getBody = {};
const data = require('../data.json');
const {
  helper1: getFilterGoods,
  // helper2: getMostExpensive,
  // helper3: getPrice,
} = require('../services/helpers');

function getReqfilterGoods(req, res, params) {
  const {
    goods,
    code,
    codeNoContent,
    messageNoContent,
    codeWrongValid,
    messageWrongValid,
  } = services.filter();
  if (validate(params) === false) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
  }
  if (Object.keys(params).length === 0) {
    res.statusCode = code;
    res.write(JSON.stringify(goods));
    res.end();
  } else {
    let resultGoods = goods;
    Object.keys(params).forEach((key) => {
      const value = params[key];
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

function validate(params) {
  return (
    typeof params.item === 'string' ||
    typeof params.type === 'string' ||
    typeof params.weight === 'number' ||
    typeof params.quantity === 'number' ||
    (!!params.pricePerKilo &&
      params.pricePerKilo[0] === '$' &&
      !Number.isNaN(Number(params.pricePerKilo.slice(1)).toFixed(2))) ||
    (!!params.pricePerItem &&
      params.pricePerItem[0] === '$' &&
      !Number.isNaN(Number(params.pricePerItem.slice(1)).toFixed(2))) ||
    false
  );
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
