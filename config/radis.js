const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis').default;

// Create a Redis client
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
  //password: process.env.REDIS_PASSWORD // If you have a password set for Redis
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error: ', err);
});

redisClient.connect().catch(console.error);

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: 'your_secret_key', // Replace with your secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
      httpOnly: true,
      //secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 60 // 1 hour
  }
});

module.exports = {
    redisClient,
    sessionMiddleware
}