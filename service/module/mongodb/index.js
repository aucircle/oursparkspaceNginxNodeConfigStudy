let mongoose = require('mongoose');
let massage = require('./massage');
let user = require('./user')

var option = {
    auto_reconnect: true,
    poolSize: 10,
    config: {
        autoIndex: false 
    },
}

mongoose.connect(global.config.mongoURL, option);

let massages = mongoose.model("massage", massage);
let users = mongoose.model("user",user);

module.exports = {
    massage: massages,
    user: users
}
