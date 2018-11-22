const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect(
  'mongodb://Calvin:' + process.env.MONGO_ATLAS_PW + '@nodestore-shard-00-00-sw8ty.mongodb.net:27017,nodestore-shard-00-01-sw8ty.mongodb.net:27017,nodestore-shard-00-02-sw8ty.mongodb.net:27017/test?ssl=true&replicaSet=nodeStore-shard-0&authSource=admin&retryWrites=true',
  {
    auth: {
      user: 'Calvin',
      password: process.env.MONGO_ATLAS_PW
    },
    useNewUrlParser: true
  },
  function(err, client) {
    if (err) {
      console.log(err);
    }
    console.log('connect!!!');
  }
);
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

//its a login package
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorizatoin'
    );
    if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
          messgae: error.messgae
        }
    });
});

module.exports = app;
