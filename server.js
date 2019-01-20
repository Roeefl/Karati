const express = require('express');
const bodyParser= require('body-parser');
const path = require('path');

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const MongoStore = require('connect-mongo')(expressSession);

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
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(express.static('public'));
app.set('view engine', 'ejs');
// app.use(express.static('client/build'));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));

const passportService = require('./services/passport');
passportService(app);

const PORT = process.env.PORT || 9000;

mongoose.connect(process.env.ATLAS_CONNECTION, { useNewUrlParser: true } );
let db = mongoose.connection;

app.use(
  expressSession(
    {
      secret: 'keyboard cat',
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
      }
    }
  )  
);

// nothing

app.use(
  cookieParser()
);

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

console.log(path.resolve(__dirname, 'client', 'build', 'index.html'));

if (process.env.NODE_ENV === 'production') {
  // Express will serve production assets like our main.js file, main.css file etc
  app.use(express.static('client/build'));

  // Express will serve the index.html file if it does not recognize the route
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('/', (req, res) => {
  console.log('I AM APP GET / AND I RENDER INDEX WITH EJS');
  res.render('index', { user: req.user });
});

// app.get('/error-codes', (req, res) => {
//   res.end( JSON.stringify(errors) );
// });