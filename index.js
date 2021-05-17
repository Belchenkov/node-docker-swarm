const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const cors = require('cors');

const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET
} = require('./config/config');

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
});

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

// Controllers
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(cors({}));

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/db?authSource=admin`;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to DB...')
    }).catch(e => console.log(e));


app.get('/api/v1', (req, res) => {
    res.send('<h2>Hi There</h2>');
});

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

app.enable("trust proxy");

//Configure session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}))

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on http://127.0.0.1:${port}`);
});