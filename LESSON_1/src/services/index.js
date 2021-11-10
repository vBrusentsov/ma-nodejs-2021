const goods = require('../data.json');
// const {
//   helper1: getFilterGoods,
//   helper2: getMostExpensive,
//   helper3: getPrice,
// } = require('./helpers');

function filter() {
  return {
    code: 200,
    goods,
  };
}

function notFound() {
  return {
    code: 404,
    message: 'Not Found',
  };
}

module.exports = {
  filter,
  notFound,
};