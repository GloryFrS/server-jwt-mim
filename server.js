const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const dbConnect      = require('./config/db');
const config = require('config');
const app = express();
const routes = require('./routes')



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


dbConnect().then(() => {
  app.listen(config.app.server.port, function () {
    console.log(`We live on ${config.app.server.port} port`);
  });
}).catch(() => {
  console.log('Unable to connect to database');
  process.exit(1)
});

routes(app);


