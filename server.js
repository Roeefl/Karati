const express = require('express');
const bodyParser= require('body-parser');

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(expressSession);

const mongoose = require('mongoose');
require('./models/User');
require('./models/Book');
require('./models/Match');

/* Models */
// const User = mongoose.model('users');
// const Book = mongoose.model('books');
// const Match = mongoose.model('matches');

require('dotenv').config();

const app = express();
const mongoStore = new MongoDBStore({
  uri: process.env.ATLAS_CONNECTION,
  collection: 'userSessions'
});

// Catch errors
mongoStore.on('error', function(error) {
  // assert.ifError(error);
  // assert.ok(false);
  console.log(error);
});
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
// app.use(express.static('client/build'));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));

app.use(
  expressSession(
    {
      secret: 'keyboard cat',
      store: mongoStore,
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
      }
    }
  )  
);

app.use(
  cookieParser()
);


// nothing

const passportService = require('./services/passport');
passportService(app);

const PORT = process.env.PORT || 9000;

mongoose.connect(process.env.ATLAS_CONNECTION, {useNewUrlParser: true} );
let db = mongoose.connection;

db.on('error', function () {
  console.log('connection error on mongoose')
});
db.once('open', function() {
    app.listen(PORT, () => {
      console.log('Listening on port ' + PORT);
    });
    console.log('Mongoose connected to MongoDB Atlas');
});

require('./routes/authRoutes')(app);
require('./routes/bookRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/shelfRoutes')(app);
require('./routes/swipeRoutes')(app);
require('./routes/matchRoutes')(app);

app.get('/', (req, res) => {
  console.log('I AM APP GET / AND I RENDER INDEX WITH EJS');
  res.render('index', { user: req.user });
});

// app.get('/error-codes', (req, res) => {
//   res.end( JSON.stringify(errors) );
// });