/**
 * 路由模块
 */
let handler = require('../module/handler') // 引入 业务逻辑 模块
module.exports = function(app){
    // 分别将对应的路由和业务逻辑进行绑定
    app.get("/theLastOne",handler.findTheLastOne);
    app.post("/addMsg",handler.addMsg);
    app.get('/sortByMsg',handler.findAllSorted);
    app.post('/newUser',handler.newUser);
}