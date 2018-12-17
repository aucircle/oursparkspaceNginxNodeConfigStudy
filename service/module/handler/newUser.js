/**
 * 业务逻辑-NewUser模块
 * 处理需获取OpenId的相关请求
 */
// 引入依赖
let db = require('../mongodb') // 连接数据库
let request = require('request') // 可以发起网络请求
module.exports = function(req,res,next){
    request("https://api.weixin.qq.com/sns/jscode2session?"+ // 使用request发出请求 访问微信服务器
    "appid="+global.config.appid+
    "&secret="+global.config.secretKey+
    "&js_code="+req.body.code+
    "&grant_type=authorization_code" // url 一波拼接字符串
    , async (err, rec)=>{ // 根据不同的情况进行处理
        if(err){
            console.error(err);
            res.writeHead(500, { "Content-Type": "application/json;charset=utf-8" });
            res.end(JSON.stringify({code: 500, msg: "网络请求错误"}));
            next();
        }else{
            rec.body = JSON.parse(rec.body);
            if(!rec.body.errcode){
                let newUser = await db.user.addUser(rec.body.openid, res['session_key']);
                if(newUser){
                    res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify({code: 200, msg: "添加用户成功,OpenID是:" + rec.body.openid}));
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