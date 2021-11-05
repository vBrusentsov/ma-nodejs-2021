function getFilterGoods(array, key, value) {
  return array.filter((product) => product[key] === value);
}

module.exports = getFilterGoods;
