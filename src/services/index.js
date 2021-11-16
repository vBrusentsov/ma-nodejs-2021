const goods = require('../data.json');

const codes = {
  codeWrongValid: 400,
  messageWrongValid: 'No Validate Message',
  codeNoContent: 400,
  messageNoContent: 'No content',
  code: 200,
  goods,
};

const notFound = {
  code: 404,
  message: 'Not Found',
};

module.exports = {
  codes,
  notFound,
};
