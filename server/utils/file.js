const DatauriParser  = require("datauri/parser");
const parser = new DatauriParser();

const bufferToDataUri = (format, buffer) => parser.format(format, buffer);

module.exports = bufferToDataUri;