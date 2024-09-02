require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const redis = require('redis');
// const session = require('express-session');
// const RedisStore = require('connect-redis').default;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// // Create a Redis client
// const redisClient = redis.createClient({
//   host: 'localhost',
//   port: 6379,
//   //password: process.env.REDIS_PASSWORD // If you have a password set for Redis
// });

// redisClient.on('error', (err) => {
//   console.error('Redis error: ', err);
// });

// redisClient.connect().catch(console.error);

// app.use(session({
//   store: new RedisStore({ client: redisClient }),
//   secret: 'your_secret_key', // Replace with your secret key
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//       httpOnly: true,
//       //secure: process.env.NODE_ENV === 'production',
//       sameSite: 'Strict',
//       maxAge: 1000 * 60 * 60 // 1 hour
//   }
// }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public/images')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//for user routes
// const userRoute = require('./routes/index.js');
// app.use('/',userRoute);

module.exports = app;
