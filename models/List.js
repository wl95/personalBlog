const mongoose = require('mongoose');

let listSchema = require('../schemas/lists');

module.exports = mongoose.model("List",listSchema);