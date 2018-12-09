const passport = require('passport');

module.exports = (app) => {
    app.get('/login/google',
        passport.authenticate('google',
            {
                successRedirect: '/',
                scope: ['profile', 'email']
            }
        )
    );

    app.get('/login/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect('http://localhost:3000/');
        }
    );

    app.get('/login/facebook',
        passport.authenticate('facebook',
            {
                successRedirect: '/',
                scope: ['profile']
            }
        )
    );

    app.get('/login/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect('/');
        }
    );
}