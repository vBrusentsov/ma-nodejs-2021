// const data = require('../data.json');
// const {
//   helper1: getFilterGoods,
//   helper2: getMostExpensive,
//   helper3: getPrice,
// } = require('./helpers');

// function goods() {
//   return {
//     code: 200,
//     message: data,
//   };
// }

function notFound() {
  return {
    code: 404,
    message: 'Not Found',
  };
}

module.exports = {
  // goods,
  notFound,
};
