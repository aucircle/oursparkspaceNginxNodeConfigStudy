let mongoose = require('mongoose');
let message = require('./message');
let user = require('./user')

var option = {
    auto_reconnect: true,
    poolSize: 10,
    config: {
        autoIndex: false 
    },
}

mongoose.connect(global.config.mongoURL, option);

let messages = mongoose.model("message", message);
let users = mongoose.model("user",user);

module.exports = {
    message: messages,
    user: users
}
