
global.config = global.config || {}; // 创建一个config类
global.config.mongoURL = global.config.mongoURL || "mongodb://127.0.0.1:27017/cloud"; // mongodb数据库的连接url
global.config.port = global.config.port || 8080; // 这个脚本监听的端口号
global.config.appid = ""; // 微信小程序的appid 用来获取openID
global.config.secretKey = ""; // 微信小程序的secretKey 用途同上

// 连接数据库
let mongoose = require('mongoose');
let Schema = mongoose.Schema

// 用来保存上传信息的数据格式模板
let message = new Schema({
    commit: String,
    uploadDate: Date
})
// 创建静态方法
message.static('getTheLastOne', function(){ // 得到最后上传一个信息
    return new Promise((rec, rej) => {
        this.find({}).sort({'_id': -1}).limit(1).exec((err,doc)=>{
            // 所有的数据 -> 按照 "_id"(随时间单调递增)降序排序 -> 只取出一个 -> 传出
            if(err)rej(err);
            else rec(doc);
        })
    })
})
message.static('newmessage',function(msg){ // 添加新的消息的静态函数
    return new Promise((rec, rej)=>{
        let newMsg = new this({ // 相当与 取出一张空表 然后填表
            commit: msg,
            uploadDate: new Date()
        })
        newMsg.save((err, product)=>{ // 把这个填好的表格放到数据库里
            if(err) rej(err);
            else rec(product);
        })
    })
})
message.static('getTheListSortWithCommit', function(){ // 按照内容首字母排序获得所有
    return new Promise((rec, rej) => {
        this.find({}).sort({'commit': 1}).exec((err,docs)=>{
            // 找所有的数据 -> 按照内容升序排列 -> 传出
            if(err) rej(err);
            else{
                let out = [];
                for (const doc of docs) {
                    out.push({
                        msg: doc.commit,
                        uploadDate: doc.uploadDate
                    })
                }
                rec(out);
            };
        })
    })
})

// 存储OpenId的数据模板
let user = new Schema({
    openid: String,
    sessionKey: String, 
    other: Object
})
user.static('addUser', function(openid, sessionKey, other){
    return new Promise(async(rec,rej)=>{
        let userIn = await this.find({openid}).exce();
        // ES6 的新语法糖 有兴趣的可以了解一下,有利于减少回调
        // 这里就是同步的把openid查出来(如果有的话)
        if(userIn.length == 0){ // 这种情况就是没找到(找到0个)
            let newUser = new this({ // 取出来一张新的表格登记上
                openid,
                sessionKey,
                other
            })
            newUser.save((err, product)=>{ // 保存
                if(err) rej(err);
                else rec(product)
            })
        }else{ // 如果这个人之前存在过
            userIn[0].sessionKey = sessionKey; // 那么我们就更新一下信息
            userIn[0].other = other || userIn[0].other;
            userIn[0].save((err, product)=>{ // 并且保存
                if(err) rej(err);
                else rec(product)
            })
        }
    })
})

// 这里是关于数据库连接的配置,有兴趣可以看看文档.
var option = {
    auto_reconnect: true,
    poolSize: 10,
    config: {
        autoIndex: false 
    },
}
// 连接数据库
mongoose.connect(global.config.mongoURL, option);

// 把上面的模板具体的实例化到数据库里
let messages = mongoose.model("message", message);
let users = mongoose.model("user",user);



// 引入模块
let app = require('express')();
let morgan = require('morgan');
let bodyParser = require('body-parser');
let request = require('request')

//初始化中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'))

// 路由
app.get("/theLastOne", async function (req, res, next) {
    let doc = await messages.getTheLastOne();
    if (!doc) {
        res.writeHead(404, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({ code: 404, msg: "啥都没找到。" }))
        next()
    } else {
        res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({ code: 200, msg: doc[0].commit }))
        next()
    }
});
app.post("/addMsg", async function(req,res,next){
    try{
        await messages.newmessage(req.body.msg);
        res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({code: 200, msg: "添加成功"}))
        next()
    }catch(e){
        console.error(e);
        res.writeHead(404, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({code: 404, msg: "添加失败"}))
        next()
    }
});
app.get('/sortByMsg', async function(req, res, next){
    let docs = await messages.getTheListSortWithCommit();
    if (!docs) {
        res.writeHead(404, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({ code: 404, msg: "啥都没找到。" }))
        next()
    } else {
        res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
        res.end(JSON.stringify({ code: 200, msg: docs }))
        next()
    }
});
app.post('/newUser',function(req,res,next){
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
                let newUser = await users.addUser(rec.body.openid, res['session_key']);
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
});

// 监听端口
app.listen(global.config.port);
console.log("server is listening on " + global.config.port)
