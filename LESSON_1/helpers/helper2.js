const data = require('../data.json');

function getMostExpensive(array = data) {
  let leastPrice = null;
  let leastProduct = null;

  array.forEach((product) => {
    const calculate =
      +(product.pricePerKilo || product.pricePerItem)
        .slice(1)
        .replace(',', '.') * (product.weight || product.quantity);

    if (leastProduct === null || leastPrice < calculate) {
      leastPrice = calculate;
      leastProduct = product;
    }
  });

  return leastProduct;
}

module.exports = getMostExpensive;
