/**
 * 数据库模块-message
 * 数据模板
 * 静态方法
 */
let Schema = require('mongoose').Schema // 引入模板母类
let message = new Schema({ // 实例化一个数据模板
    // 包括两个值
    commit: String, // commit 字符串类型 用来存储上传的消息
    uploadDate: Date // UploadDate 时间类型 用来记录上传的时间
})
message.static('getTheLastOne', function(){ // 创建静态方法 getTheLastOne 使用方法见 业务逻辑模块
    return new Promise((rec, rej) => {// 这个写法有待商榷...
        this.find({}).sort({'_id': -1}).limit(1).exec((err,doc)=>{// 链式传参
            // 找所有 -> 按照 _id的降序排序 -> 只要一个
            // PS: _id随时间的流逝逐渐变大
            if(err)rej(err);
            else rec(doc);
        })
    })
})
message.static('newmessage',function(msg){ // 创建静态方法 newmessage
    return new Promise((rec, rej)=>{    
        let newMsg = new this({ // 实例化一条数据
            commit: msg,
            uploadDate: new Date()
        })
        newMsg.save((err, product)=>{ // 保存这条数据
            if(err) rej(err);
            else rec(product);
        })
    })
})
message.static('getTheListSortWithCommit', function(){ // 创建静态方法
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
module.exports = message; // 引出模块