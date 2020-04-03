const mongoose = require('mongoose');

let listSchema = require('../schemas/users');

module.exports = mongoose.model("User",listSchema);