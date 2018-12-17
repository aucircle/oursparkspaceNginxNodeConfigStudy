/**
 * 业务逻辑-findTheLastOne模块
 * 用于处理返回最后一条信息的逻辑
 */
// 引入依赖
let db = require('../mongodb') // 连接数据库
module.exports = async function (req, res, next) {
    let doc = await db.message.getTheLastOne(); // 使用await同步取回查询结果
    if (!doc) {
        res.writeHead(404, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({ code: 404, msg: "啥都没找到。" }))
        next()
    } else {
        res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({ code: 200, msg: doc[0].commit }))
        next()
    }
}