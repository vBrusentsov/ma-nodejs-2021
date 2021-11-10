function getPrice(goods) {
  return goods.map((product) => {
    const price =
      +(product.pricePerKilo || product.pricePerItem)
        .slice(1)
        .replace(',', '.') * (product.weight || product.quantity);
    const newproduct = {
      ...product,
      price,
    };
    return newproduct;
  });
}

module.exports = getPrice;
