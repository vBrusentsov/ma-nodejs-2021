const codes = {
  codeWrongValid: 400,
  messageWrongValid: 'No Validate Message',
  codeNoContent: 400,
  messageNoContent: 'No content',
  codeOK: 200,
  messageServerError: 'Internal Server Error',
  codeServerError: 500,
};

const notFound = {
  code: 404,
  message: 'Not Found',
};

module.exports = {
  codes,
  notFound,
};
