module.exports = function(){
    global.config = global.config || {};
    global.config.mongoURL = global.config.mongoURL || "mongodb://127.0.0.1:27017/cloud";
    global.config.port = global.config.port || 8080;
    global.config.appid = "";
    global.config.secretKey = "";
}