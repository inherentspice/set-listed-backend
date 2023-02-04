const path = require('path');
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

const formatBufferTo64 = file => {
  return parser.format(path.extname(file.originalname).toString(), file.buffer);
}

module.exports = formatBufferTo64;
