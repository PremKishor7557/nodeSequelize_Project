const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis').default;

// Create a Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',  // Use the environment variable or default to 'localhost'
  port: process.env.REDIS_PORT || 6379,         // Use the environment variable or default to 6379
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