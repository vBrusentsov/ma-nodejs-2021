const util = require('util');
const {
  helper1: getFilterGoods,
  helper2: getMostExpensive,
  helper3: getPrice,
} = require('./helpers');
const discountPriceCallback = require('./discountPrice');
const goods = require('../data.json');

const codes = {
  codeWrongValid: 400,
  messageWrongValid: 'No Validate Message',
  codeNoContent: 400,
  messageNoContent: 'No content',
  codeOK: 200,
  messageServerError: 'Internal Server Error',
  codeServerError: 500,
};
function getPromiseDiscount(req) {
  const goodsWithPrice = getPrice((req.method = 'GET' ? goods : req.body));
  const promisesDiscount = goodsWithPrice.map(
    (product) => () =>
      new Promise((resolve, reject) => {
        discountPriceCallback((err, value) => {
          if (err) {
            return reject(err);
          }
          const discount = product.price * ((100 - value) / 100);
          const discountProducts = {
            ...product,
            priceWithDiscount: discount,
          };

          return resolve(discountProducts);
        });
      }),
  );
  const promisesDiscountRetry = promisesDiscount.map((promise) =>
    retryPromises(promise),
  );
  return { promisesDiscountRetry };
}

function getPromisifyDiscountPrice(req) {
  const goodsWithPrice = getPrice(req.method === 'GET' ? goods : req.body);
  const promisifyDiscount = goodsWithPrice.map((product) => () => {
    const promisifyCallback = util.promisify(discountPriceCallback);
    return promisifyCallback()
      .then((value) => {
        const discount = product.price * ((100 - value) / 100);
        const discountProducts = {
          ...product,
          priceWithDiscount: discount,
        };
        return discountProducts;
      })
      .catch((err) => {
        console.log(err);
      });
  });
  const promisifyDiscountRetry = promisifyDiscount.map((promise) =>
    retryPromises(promise),
  );
  return { promisifyDiscountRetry };
}

async function getAsyncDiscountPrice(req) {
  const goodsWithPrice = getPrice(req.method === 'GET' ? goods : req.body);
  const asyncDiscount = goodsWithPrice.map((product) => () => {
    const promisifyCallback = util.promisify(discountPriceCallback);
    return promisifyCallback().then((value) => {
      const discount = product.price * ((100 - value) / 100);
      const discountProducts = {
        ...product,
        priceWithDiscount: discount,
      };

      return discountProducts;
    });
  });
  const promisifyDiscountRetry = asyncDiscount.map((promise) =>
    retryPromises(promise),
  );
  return { promisifyDiscountRetry };
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

const notFound = {
  code: 404,
  message: 'Not Found',
};

module.exports = {
  codes,
  notFound,
  getPromiseDiscount,
  getPromisifyDiscountPrice,
  getAsyncDiscountPrice,
};
