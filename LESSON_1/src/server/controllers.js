const services = require('../services');
const data = require('../data.json');
// const {
//   helper1: getFilterGoods,
//   helper2: getMostExpensive,
//   helper3: getPrice,
// } = require('./helpers');

// function filterGoods(req, res) {
//   const { message, code } = services.filterGoods();
//   res.write(message);
//   res.statusCode = code;
//   res.end();
// }

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
  res.write(message);
  res.end();
}

module.exports = {
  // filterGoods,
  // mostExpensive,
  // price,
  // goods,
  notFound,
};
