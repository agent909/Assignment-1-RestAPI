const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const loginRoute = require('./api/routes/user');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use( (req, res, next) => {
    req.header('Access-Control-Allow-Origin','*');
    req.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();

})

app.use('/user', loginRoute);

app.use( (req, res, next) => {
    const error = new Error('This is an error handler');
    error.status = 404;
    next(error);
});

app.use( (error, eq, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;