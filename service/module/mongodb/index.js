/**
 * 数据库模块 总模块
 * 负责进行数据库连接 数据模板的实例化
 */
// 引入依赖
let mongoose = require('mongoose'); // Mongoose
let message = require('./message'); // 数据模板 message
let user = require('./user') // 数据模板 user

var option = { // 连接配置
    auto_reconnect: true,
    poolSize: 10,
    config: {
        autoIndex: false 
    },
}

mongoose.connect(global.config.mongoURL, option); // 建立连接

let messages = mongoose.model("message", message); // 根据数据模板实例化数据表
let users = mongoose.model("user",user);

module.exports = { // 引出模块
    message: messages,
    user: users
}
