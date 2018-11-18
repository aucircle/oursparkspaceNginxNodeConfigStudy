let db = require('../mongodb')
let request = require('request')
module.exports = function(req,res,next){
    request("https://api.weixin.qq.com/sns/jscode2session?"+
    "appid="+global.config.appid+
    "&secret="+global.config.secretKey+
    "&js_code="+req.body.code+
    "&grant_type=authorization_code"
    , async (err, rec)=>{
        if(err){
            res.writeHead(500, { "Content-Type": "application/json;charset=utf-8" });
            res.end(JSON.stringify({code: 500, msg: "网络请求错误"}));
            next();
        }else{
            rec.body = JSON.parse(rec.body);
            if(!rec.body.errcode){
                let newUser = await db.user.addUser(rec.body.openid, res['session_key']);
                if(newUser){
                    res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify({code: 200, msg: "添加用户成功"}));
                    next();
                }else{
                    res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify({code: 505, msg: "添加用户失败"}));
                    next();
                }
            }else{
                res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
                res.end(JSON.stringify({code: rec.body.errcode, msg: rec.body.errmsg}));
                next();
            }
        }
    })
}