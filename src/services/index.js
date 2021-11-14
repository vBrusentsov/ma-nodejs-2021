const goods = require('../data.json');

function codes() {
  return {
    codeWrongValid: 400,
    messageWrongValid: 'No Validate Message',
    codeNoContent: 400,
    messageNoContent: 'No content',
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
  codes,
  notFound,
};
