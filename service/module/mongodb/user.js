/**
 * 数据库模块-user模块
 */
let Schema = require('mongoose').Schema; // 引入数据模板母类
let user = new Schema({ // 实例化一个数据模板
    // 包含三条信息
    openid: String, // OpenId 字符串 查到的字符串
    sessionKey: String, // 用来和 微信小程序校验信息的 东西
    other: Object // 其他
})
user.static('addUser', function(openid, sessionKey, other){ // 添加一个静态方法
    return new Promise(async(rec,rej)=>{
        let userIn = await this.find({openid}).exce(); // 是否存在同样OpenId
        if(userIn.length == 0){ // 如果不存在
            let newUser = new this({ // 我们就创建一个
                openid,
                sessionKey,
                other
            })
            newUser.save((err, product)=>{ // 并保存
                if(err) rej(err);
                else rec(product)
            })
        }else{ // 如果这个OpenId的用户已经存在
            userIn[0].sessionKey = sessionKey; // 我们就更新一下
            userIn[0].other = other || userIn[0].other;
            userIn[0].save((err, product)=>{ // 并保存
                if(err) rej(err);
                else rec(product)
            })
        }
    })
})
module.exports = user;