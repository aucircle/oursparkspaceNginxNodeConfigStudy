let app = require('express')();
require('./config')();
let morgan = require('morgan');
let bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'))

require('./router')(app);

app.listen(global.config.port);
console.log("server is listening on " + global.config.port)

module.exports = app;