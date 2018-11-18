let Schema = require('mongoose').Schema
let message = new Schema({
    commit: String,
    uploadDate: Date
})
message.static('getTheLastOne', function(){
    return new Promise((rec, rej) => {
        this.find({}).sort({'_id': -1}).limit(1).exec((err,doc)=>{
            if(err)rej(err);
            else rec(doc);
        })
    })
})
message.static('newmessage',function(msg){
    return new Promise((rec, rej)=>{    
        let newMsg = new this({
            commit: msg,
            uploadDate: new Date()
        })
        newMsg.save((err, product)=>{
            if(err) rej(err);
            else rec(product);
        })
    })
})
message.static('getTheListSortWithCommit', function(){
    return new Promise((rec, rej) => {
        this.find({}).sort({'commit': 1}).exec((err,docs)=>{
            if(err)rej(err);
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
module.exports = message;