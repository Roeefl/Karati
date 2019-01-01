if (process.env.NODE_ENV === 'production') {
    // we are in production 

} else {
    module.exports = require('./dev');
}