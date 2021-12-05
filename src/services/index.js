const util = require('util');
const { helper3: getPrice } = require('./helpers');
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
        discountPriceCallback((err, discount) => {
          if (err) {
            return reject(err);
          }

          let discountPrice = product.price * ((100 - discount) / 100);
          if (product.type === 'Red Spanish') {
            discountPrice *= (100 - discount) / 100;
          }
          if (product.type === 'Tangerine') {
            discountPrice *= (100 - discount) / 100;
            discountPrice *= (100 - discount) / 100;
          }
          const discountProducts = {
            ...product,
            priceWithDiscount: discountPrice,
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
      .then((discount) => {
        let discountPrice = product.price * ((100 - discount) / 100);
        if (product.type === 'Red Spanish') {
          discountPrice *= (100 - discount) / 100;
        }
        if (product.type === 'Tangerine') {
          discountPrice *= (100 - discount) / 100;
          discountPrice *= (100 - discount) / 100;
        }
        const discountProducts = {
          ...product,
          priceWithDiscount: discountPrice,
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

function getAsyncDiscountPrice(req) {
  const goodsWithPrice = getPrice(req.method === 'GET' ? goods : req.body);
  const asyncDiscount = goodsWithPrice.map((product) => () => {
    const promisifyCallback = util.promisify(discountPriceCallback);
    return promisifyCallback().then((discount) => {
      let discountPrice = product.price * ((100 - discount) / 100);
      if (product.type === 'Red Spanish') {
        discountPrice *= (100 - discount) / 100;
      }
      if (product.type === 'Tangerine') {
        discountPrice *= (100 - discount) / 100;
        discountPrice *= (100 - discount) / 100;
      }

      const discountProducts = {
        ...product,
        priceWithDiscount: discountPrice,
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
