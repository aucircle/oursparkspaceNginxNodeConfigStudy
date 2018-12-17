/**
 * 业务逻辑-addMsg模块
 * 负责处理添加信息的业务逻辑
 */
// 引入依赖的模块
let db = require('../mongodb');// 引入数据库链接模块
module.exports = async function(req,res,next){
    try{ // 错误捕获
        await db.message.newmessage(req.body.msg); // 调用 数据库 message数据表 的静态方法 newmessage
        // await 是 ES6的语法 搭配 Promise使用 使得异步方法可以用同步的形式返回
        res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" }); // 设置头信息
        res.end(JSON.stringify({code: 200, msg: "添加成功"}));// 返回数据 
        next()// 移交控制权给框架
    }catch(e){ // 如果发生错误
        console.error(e); // 抛出错误
        res.writeHead(404, { "Content-Type": "application/json;charset=utf-8" }); // 设置信息头
        res.end(JSON.stringify({code: 404, msg: "添加失败"})) // 返回数据
        next() // 移交控制权给框架
    }
}