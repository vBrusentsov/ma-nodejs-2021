const fs = require('fs');
const path = require('path');
const util = require('util');
const { config } = require('../config');
const services = require('../services');
const goods = require('../data.json');
const {
  helper1: getFilterGoods,
  helper2: getMostExpensive,
  helper3: getPrice,
} = require('../services/helpers');

function getResultFilterGoods(req, res, params) {
  const {
    codeOK,
    codeNoContent,
    messageNoContent,
    codeWrongValid,
    messageWrongValid,
  } = services.codes;
  if (!validateParams(params)) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
  }
  if (Object.keys(params).length === 0) {
    res.statusCode = codeOK;
    res.write(JSON.stringify(goods));
    res.end();
    return;
  }

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
    return;
  }

  res.write(JSON.stringify(resultGoods));
  res.statusCode = codeOK;
  res.end();
}

function getResultMostExpensive(req, res) {
  const { codeOK, codeWrongValid, messageWrongValid } = services.codes;
  if (!req.body && (!Array.isArray(req.body) || !validateBody(req.body))) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
    return;
  }

  const resultMostExpensive = getMostExpensive(req.body);
  res.write(JSON.stringify(resultMostExpensive));
  res.statusCode = codeOK;
  res.end();
}

function getResultPrice(req, res) {
  const { codeOK, codeWrongValid, messageWrongValid } = services.codes;
  if (!req.body && (!Array.isArray(req.body) || !validateBody(req.body))) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
    return;
  }

  const resultPrice = getPrice(req.body);
  res.write(JSON.stringify(resultPrice));
  res.statusCode = codeOK;
  res.end();
}

function newData(req, res) {
  const {
    codeWrongValid,
    messageWrongValid,
    codeOK,
    messageServerError,
    codeServerError,
  } = services.codes;
  if (!Array.isArray(req.body) || !validateBody(req.body)) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
    return;
  }

  try {
    fs.writeFileSync(
      path.resolve(process.cwd(), config.DATA_PATH),
      JSON.stringify(req.body, null, 2),
    );
    res.statusCode = codeOK;
    res.end();
  } catch (err) {
    res.statusCode = codeServerError;
    console.error(err);
    res.end(JSON.stringify({ messageServerError }));
  }
}

function getPromiseDiscount(req, res) {
  const { codeOK, codeWrongValid, messageWrongValid, codeServerError } =
    services.codes;
  const { promisesDiscountRetry } = services.getPromiseDiscount(req);
  if (!Array.isArray(req.body) || !validateBody(req.body)) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
  }
  Promise.all(promisesDiscountRetry)
    .then((discountProducts) => {
      res.statusCode = codeOK;
      res.write(JSON.stringify(discountProducts));
      res.end();
    })
    .catch((err) => {
      res.statusCode = codeServerError;
      res.write(JSON.stringify(err));
      res.end();
    });
}

function getPromisifyDiscountPrice(req, res) {
  const { codeOK, messageWrongValid, codeWrongValid, codeServerError } =
    services.codes;
  const { promisifyDiscountRetry } = services.getPromisifyDiscountPrice(req);
  if (!Array.isArray(req.body) || !validateBody(req.body)) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
    return;
  }

  Promise.all(promisifyDiscountRetry)
    .then((discountProducts) => {
      res.statusCode = codeOK;
      res.write(JSON.stringify(discountProducts));
      res.end();
    })
    .catch((err) => {
      res.statusCode = codeServerError;
      res.write(JSON.stringify(err));
      res.end();
      console.log(err);
    });
}

async function getAsyncDiscountPrice(req, res) {
  const { codeOK, messageWrongValid, codeWrongValid, codeServerError } =
    services.codes;
  const { promisifyDiscountRetry } = services.getAsyncDiscountPrice(req);
  if (!Array.isArray(req.body) || !validateBody(req.body)) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
    return;
  }
  try {
    const discountProduct = await Promise.all(promisifyDiscountRetry);
    res.statusCode = codeOK;
    res.end(JSON.stringify(discountProduct));
  } catch (err) {
    res.statusCode = codeServerError;
    res.end(JSON.stringify(err));
  }
}

function validateBody(array) {
  return !array.some(
    ({ item, type, weight, quantity, pricePerKilo, pricePerItem }) =>
      (typeof item !== 'string' ||
        typeof type !== 'string' ||
        (typeof weight !== 'number' && typeof quantity !== 'number') ||
        !pricePerKilo ||
        pricePerKilo[0] !== '$' ||
        Number.isNaN(Number(pricePerKilo.slice(1)).toFixed(2))) &&
      (!pricePerItem ||
        pricePerItem[0] !== '$' ||
        Number.isNaN(Number(pricePerItem.slice(1)).toFixed(2))),
  );
}

function validateParams({
  item,
  type,
  weight,
  quantity,
  pricePerKilo,
  pricePerItem,
}) {
  return (
    typeof item === 'string' ||
    typeof type === 'string' ||
    typeof weight === 'number' ||
    typeof quantity === 'number' ||
    (pricePerKilo &&
      pricePerKilo[0] === '$' &&
      !Number.isNaN(Number(pricePerKilo.slice(1)).toFixed(2))) ||
    (!!pricePerItem &&
      pricePerItem[0] === '$' &&
      !Number.isNaN(Number(pricePerItem.slice(1)).toFixed(2))) ||
    false
  );
}

function notFound(req, res) {
  const { message, code } = services.notFound;
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

module.exports = {
  getResultFilterGoods,
  getResultMostExpensive,
  getResultPrice,
  newData,
  getPromiseDiscount,
  getPromisifyDiscountPrice,
  getAsyncDiscountPrice,
  notFound,
};
