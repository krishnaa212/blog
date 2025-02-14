const mongoose = require("mongoose");

async function mongoDbConnect(db){
  return mongoose.connect(db)
}

module.exports = {
  mongoDbConnect
}