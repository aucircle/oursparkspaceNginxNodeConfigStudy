let db = require('../mongodb')
module.exports = async function (req, res, next) {
    let doc = await db.massage.getTheLastOne();
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