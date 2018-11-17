let Schema = require('mongoose').Schema;
let user = new Schema({
    openid: String,
    sessionKey: String, 
    other: Object
})
user.static('addUser', function(openid, sessionKey, other){
    return new Promise((rec,rej)=>{
        let newUser = new this({
            openid,
            sessionKey,
            other
        })
        newUser.save((err, product)=>{
            if(err) rej(err);
            else rec(product)
        })
    })
})
module.exports = user;