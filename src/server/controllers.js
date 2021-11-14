const fs = require('fs');
const path = require('path');
const services = require('../services');

const {
  helper1: getFilterGoods,
  helper2: getMostExpensive,
  helper3: getPrice,
} = require('../services/helpers');

function getResultFilterGoods(req, res, params) {
  const {
    goods,
    code,
    codeNoContent,
    messageNoContent,
    codeWrongValid,
    messageWrongValid,
  } = services.codes();
  if (validateParams(params) === false) {
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

function getResultMostExpensive(req, res) {
  const { code, codeWrongValid, messageWrongValid } = services.codes();
  if (
    req.body !== undefined &&
    (!Array.isArray(req.body) || !validateBody(req.body))
  ) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
    return;
  }
  const resultMostExpensive = getMostExpensive(req.body);
  res.write(JSON.stringify(resultMostExpensive));
  res.statusCode = code;
  res.end();
}

function getResultPrice(req, res) {
  const { code, codeWrongValid, messageWrongValid } = services.codes();
  if (
    req.body !== undefined &&
    (!Array.isArray(req.body) || !validateBody(req.body))
  ) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
    return;
  }
  const resultPrice = getPrice(req.body);
  res.write(JSON.stringify(resultPrice));
  res.statusCode = code;
  res.end();
}

function newData(req, res) {
  const { codeWrongValid, messageWrongValid, code } = services.codes();
  if (!Array.isArray(req.body) || !validateBody(req.body)) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
    return;
  }
  fs.writeFileSync(
    path.resolve(process.cwd(), './LESSON_1/src/data.json'),
    JSON.stringify(req.body, null, 2),
  );
  res.statusCode = code;
  res.end();
}

function validateBody(array) {
  return !array.some(
    (products) =>
      !(
        (typeof products.item === 'string' &&
          typeof products.type === 'string' &&
          (typeof products.weight === 'number' ||
            typeof products.quantity === 'number') &&
          products.pricePerKilo &&
          products.pricePerKilo[0] === '$' &&
          !Number.isNaN(Number(products.pricePerKilo.slice(1)).toFixed(2))) ||
        (products.pricePerItem &&
          products.pricePerItem[0] === '$' &&
          !Number.isNaN(Number(products.pricePerItem.slice(1)).toFixed(2)))
      ),
  );
}

function validateParams(params) {
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

function notFound(req, res) {
  const { message, code } = services.notFound();
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

module.exports = {
  getResultFilterGoods,
  getResultMostExpensive,
  getResultPrice,
  newData,
  notFound,
};
