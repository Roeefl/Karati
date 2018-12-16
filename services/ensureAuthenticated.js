module.exports = {
    ensureAuthenticated: function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        
        res.end( JSON.stringify( {
            'error': errors.NOT_LOGGED_IN
        } )
        );
    }
};