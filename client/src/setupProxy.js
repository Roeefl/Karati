const proxy = require('http-proxy-middleware')
 
module.exports = function(app) {
    app.use(proxy('/login/google', { target: 'http://localhost:9000' }))
}