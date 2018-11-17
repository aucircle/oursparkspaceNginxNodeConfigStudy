let db = require('../mongodb')
module.exports = async function(req, res, next){
    let docs = await db.massage.getTheListSortWithCommit();
    if (!docs) {
        res.writeHead(404, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({ code: 404, msg: "啥都没找到。" }))
        next()
    } else {
        res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({ code: 200, msg: docs }))
        next()
    }
}