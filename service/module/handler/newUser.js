let db = require('../mongodb')
let request = require('request')
module.exports = function(req,res,next){
    request({
        method: "get",
        uri: "https://api.weixin.qq.com/sns/jscode2session",
        qs:{
            appid: global.config.appid,
            secret: global.config.secretKey,
            'js_code': req.body.code,
            'grant_type': 'authorization_code'
        }
    }).end(async (err, res)=>{
        if(err){
            res.writeHead(500, { "Content-Type": "application/json;charset=utf-8" });
            res.end(JSON.stringify({code: 500, msg: "网络请求错误"}));
            next();
        }else{
            if(res.errcode == 0){
                let newUser = await db.user.addUser(res.opid, res['session_key']);
                if(newUser){
                    res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify({code: 200, msg: "添加用户成功"}));
                    next();
                }else{
                    res.writeHead(505, { "Content-Type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify({code: 505, msg: "添加用户失败"}));
                    next();
                }
            }else{
                res.writeHead(500, { "Content-Type": "application/json;charset=utf-8" });
                res.end(JSON.stringify({code: res.errcode, msg: res.errmsg}));
                next();
            }
        }
    })
}