let handler = require('../module/handler')
module.exports = function(app){
    app.get("/theLastOne",handler.findTheLastOne);
    app.post("/addMsg",handler.addMsg);
    app.get('/sortByMsg',handler.findAllSorted);
    app.post('/newUser',handler.newUser);
}