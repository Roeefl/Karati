const passport = require('passport');

const middleware = require('../common/middleware');

module.exports = (app) => {
    app.get('/login/google',
        passport.authenticate('google',
            {
                successRedirect: '/',
                scope: ['profile', 'email']
            }
        )
    );

// app.get('/login/google', (req, res) => {
//     console.log(req);
//     res.end(req.user || false);
//     });

    app.get('/login/google/callback      ',
        passport.authenticate('google', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect(process.env.REDIRECT_DOMAIN);
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

    app.get('/api/currentUser', middleware.ensureAuthenticated, (req, res) => {
        res.end(JSON.stringify(
            { currUser: middleware.reverseNotifications(req.user) }
        ));
    });
    
    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });   
}