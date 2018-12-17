/**
 *  微信小程序简易树洞后端
 */
// 基础
let app = require('express')(); // 实例化一个 express 服务

// 配置
require('./config')(); // 引入 config 文件

// 插件 
// 插件-使express解析POST请求的插件
let morgan = require('morgan'); // 引入morgan模块
let bodyParser = require('body-parser'); // 引入body-parser 模块
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'))

// 路由
require('./router')(app); // 引入路由

// 启动
app.listen(global.config.port); // 服务监听配置文件中的端口启动
console.log("server is listening on " + global.config.port) // 输出一行提示字符

// 测试接口
module.exports = app; // 将服务引出 方便测试