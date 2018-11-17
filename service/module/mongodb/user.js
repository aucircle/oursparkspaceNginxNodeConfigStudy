let Schema = require('mongoose').Schema;
let user = new Schema({
    openid: String,
    sessionKey: String, 
    other: Object
})
user.static('addUser', function(openid, sessionKey, other){
    return new Promise(async(rec,rej)=>{
        let userIn = await this.find({openid}).exce();
        if(userIn.length == 0){
            let newUser = new this({
                openid,
                sessionKey,
                other
            })
            newUser.save((err, product)=>{
                if(err) rej(err);
                else rec(product)
            })
        }else{
            userIn[0].sessionKey = sessionKey;
            userIn[0].other = other || userIn[0].other;
            userIn[0].save((err, product)=>{
                if(err) rej(err);
                else rec(product)
            })
        }
    })
})
module.exports = user;