/**
 * 业务逻辑-findAllSorted模块
 * 查询所有的信息并按照信息内容的自然顺序进行排序返回
 */
// 引入依赖
let db = require('../mongodb') // 引入数据库
module.exports = async function(req, res, next){
    let docs = await db.message.getTheListSortWithCommit(); // 使用await同步返回查询结果
    if (!docs) { // 判断是否找对了数据
        res.writeHead(404, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({ code: 404, msg: "啥都没找到。" }))
        next()
    } else {
        res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({ code: 200, msg: docs }))
        next()
    }
}