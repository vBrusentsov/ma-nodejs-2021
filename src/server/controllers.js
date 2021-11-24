const fs = require('fs');
const path = require('path');
const { config } = require('../config');
const services = require('../services');
const goods = require('../data.json');
const {
  helper1: getFilterGoods,
  helper2: getMostExpensive,
  helper3: getPrice,
} = require('../services/helpers');
const discountPriceCallback = require('./discountPrice');

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
  const { codeOK, codeWrongValid, messageWrongValid } = services.codes;
  if (!Array.isArray(req.body) || !validateBody(req.body)) {
    res.statusCode = codeWrongValid;
    res.end(JSON.stringify({ messageWrongValid }));
    return;
  }
  const goodsWithPrice = getPrice(goods);
  const promisesDiscount = goodsWithPrice.map(
    (product) => () =>
      new Promise((resolve, reject) => {
        discountPriceCallback((err, value) => {
          if (err) {
            return reject(err);
          }
          const discountProduct = {
            ...product,
            priceWithDiscount: value,
          };

          return resolve(discountProduct);
        });
      }),
  );
  const promisesDiscountRetry = promisesDiscount.map((promise) =>
    retryPromises(promise),
  );
  Promise.all(promisesDiscountRetry)
    .then((discountProduct) => {
      res.statusCode = codeOK;
      res.write(JSON.stringify(discountProduct));
      res.end();
    })
    .catch((err) => {
      res.statusCode = codeOK;
      res.write(JSON.stringify(promisesDiscount.then(), err));
      res.end();
    });
  // console.log(promiseDiscount);
}
function retryPromises(fn, ms = 0) {
  return new Promise((resolve) =>
    fn()
      .then(resolve)
      .catch(() => {
        setTimeout(() => {
          retryPromises(fn, ms).then(resolve);
        }, ms);
      }),
  );
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
const promisePriceWithDiscount = new Promise((resolve, reject) => {});
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
  notFound,
};
