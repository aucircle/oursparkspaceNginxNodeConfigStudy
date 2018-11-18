let db = require('../mongodb');
module.exports = async function(req,res,next){
    try{
        await db.message.newmessage(req.body.msg);
        res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({code: 200, msg: "添加成功"}))
        next()
    }catch(e){
        console.error(e);
        res.writeHead(404, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({code: 404, msg: "添加失败"}))
        next()
    }
}