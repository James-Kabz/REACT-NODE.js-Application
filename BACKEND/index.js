const express = require('express')
const app = express();
const adminRoute = require('./routes/adminRoute')
const userRoute = require('./routes/userRoute')
const saleRoute = require('./routes/saleRoute')
const gameRoute = require('./routes/gameRoute')
// const createHttpError = require('http-errors');
const cors = require('cors');
const { default: helmet } = require('helmet');
const { default: rateLimit } = require('express-rate-limit');


const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in 15 minutes'
})

app.use(helmet());
app.use('/api', limiter)
require('./model/dbConnect')
require('dotenv').config()

// const corOptions = {
//     origin: 'http://localhost:3000',
//     origin: 'https://localhost:4000'
// }
// app.use(cors(corOptions))

app.use(cors({
    origin: 'http://localhost:3000',
    // origin: 'http://localhost:4000',
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRoute)
app.use('/api/user', userRoute)
app.use('/api/sale', saleRoute)
app.use('/api/game', gameRoute)


app.use((err, req, res, next) => {
    if (err.status === 401) {
        res.status(401).send({
            error: {
                status: 401,
                message: 'Unauthorized invalid username/password'
            }
        })
    } else {
        res.status(err.status || 500).send({
            error: {
                status: err.status || 500,
                message: err.message || 'Internal Server Error'
            }
        });
    }
});

// app.use(async(req, res, next)=> {
//     next(createHttpError.NotFound())
// })



app.listen(process.env.port || 4000, function () {
    console.log('Now listening for requests on : http://localhost:4000');
});