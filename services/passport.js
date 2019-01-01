const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;

const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.use(new GoogleStrategy (
{
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
    async function(request, accessToken, refreshToken, profile, done) {
        // console.log(profile);

        const existingUser = await User.findOne( { oauthID: profile.id } );

        if (existingUser) {
            existingUser.lastLogin = Date.now();
            await existingUser.save();
            return done(null, existingUser);
        }

        newUser = new User(
            {
                oauthID: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                createdAt: Date.now(),
                fullName: {
                    first: profile.name.givenName,
                    last: profile.name.familyName
                },
                bio: '',
                passedIntro: false,
                ownedBooks: [],
                swipes: []
            }
        );

        const savedUser = await newUser.save();
        console.log(`Successfully saved user ${savedUser.username} using Mongoose.`);
        done(null, savedUser);
    }
));

// passport.use(new FacebookStrategy (
// {
//     clientID: process.env.FACEBOOK_CLIENT_ID,
//     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     callbackURL: process.env.FACEBOOK_CALLBACK_URL,
// },
//     async function(request, accessToken, refreshToken, profile, done) {
//         const existingUsesr = await User.findOne( { oauthID: profile.id } );

//         if (existingUser) {
//             existingUser.lastLogin = Date.now();
//             await existingUser.save();
//             return done(null, existingUser);
//         }
    
//         newUser = new User(
//             {
//                 oauthID: profile.id,
//                 name: profile.displayName,
//                 createdAt: Date.now(),
//                 passedIntro: false,
//                 ownedBooks: [],
//                 swipes: []
//             }
//         );
    
//         const savedUser = await newUser.save();
//         console.log('saving user to mongoose');
//         done(null, savedUser);
//     }
// ));

// Configure Passport authenticated session persistence
passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user._id);
    done(null, user._id);
});

passport.deserializeUser( async (id, done) => {
    const findUser = await User.findById(id);
    console.log('deserializeUser : ' + findUser._id);
    done(null, findUser);
    // else done(err, null);
});

module.exports = (app) => {
    // Initialize Passport and restore authentication state, if any, from the session
    app.use(passport.initialize());
    app.use(passport.session());  
}