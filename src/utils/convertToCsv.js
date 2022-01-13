function convertToCsv(request) {
  const result = [];

  const parsed = request.split('\n').map((row) => row.split(','));

  const headers = parsed[0];
  const values = parsed.slice(1);

  values.forEach((element) => {
    const products = {};
    element.forEach((value, valueIndex) => {
      const key = headers[valueIndex];
      // console.log(key);
      // console.log(value, valueIndex);
      products[key] = value;
    });
    result.push(products);
  });
  return result;
}

module.exports = {
  convertToCsv,
};
