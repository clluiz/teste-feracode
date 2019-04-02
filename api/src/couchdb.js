const config = require('../config.json');
const nano = require('nano')(config.COUCHDB_URI);
module.exports = nano;


