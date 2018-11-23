module.exports = {

    'facebookAuth' : {
        'clientID'      : '285457868749583', // your App ID
        'clientSecret'  : '065c125e5b4c3ec0eaeae76fa2ed3e3a', // your App Secret
        'callbackURL'   : 'http://localhost:9000/login/facebook/return',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

    'googleOAuth' : {
        'clientID'      : '630591049234-p830s7ldqiopqvh6e5cu83erpo03qaim.apps.googleusercontent.com',
        'clientSecret'  : 'sgi_GgfvhcZIMo7SmTgvj0kN',
        'callbackURL'   : 'http://localhost:9000/login/google/callback'
    },

    'goodreads' : {
        'key'           : 'tww0u4mt3LF2cEYOwo88A',
        'secret'        :  'z5BfwtkdN7vCx2CGj6gqxJkrTz9Zv373xgCjdHnRY'
    }

};