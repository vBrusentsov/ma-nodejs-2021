const data = require('./data.json');
const {
  helper1: getFilterGoods,
  helper2: getMostExpensive,
  helper3: getPrice,
} = require('./helpers');

function boot(products) {
  // console.log(getPrice(products));
  const oranges = getFilterGoods(products, 'item', 'orange');
  const filterOranges = getFilterGoods(oranges, 'weight', 4);
  console.log(filterOranges);
  console.log(getMostExpensive(filterOranges));
  const mostExpensetiveOranges = getMostExpensive(filterOranges);
  console.log(getPrice([mostExpensetiveOranges]));
  console.log(getMostExpensive());
  return products;
}

boot(data);
