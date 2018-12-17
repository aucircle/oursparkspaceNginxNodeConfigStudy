/**
 * 业务逻辑模块 总引出模块
 * 负责整合不同的业务模块统一引出
 */
// 引入各部分业务逻辑模块
let findTheLastOne = require('./findTheLastOne') 
let addMsg = require('./addMsg')
let findAllSorted = require('./findAllSorted')
let newUser = require('./newUser')
// 引出所有的业务逻辑
module.exports = {
    findTheLastOne,
    addMsg,
    findAllSorted,
    newUser
}