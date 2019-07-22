const jwt = require('jsonwebtoken');
const User = require('../models/User');
const withAuth = require('../middleware');
const config = require('config');
const path = require('path');

const secret = config.app.server.secret;

module.exports = function(app) {

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
  app.get('/api/home', function(req, res) {
    res.send('Welcome!');
  });
  
  app.get('/api/secret', withAuth, function(req, res) {
    res.send('The password is potato');
  });
  
  app.post('/api/register', function(req, res) {
    const { id, password } = req.body;
    const user = new User({ id, password });
    user.save(function(err) {
      if (err) {
        console.log(err);
        res.status(500).send("Error registering new user please try again.");
      } else {
        res.status(200).send("Welcome to the club!");
      }
    });
  });
  
  app.post('/api/authenticate', function(req, res) {
    const { id, password } = req.body;
    User.findOne({ id }, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401)
          .json({
          error: 'Incorrect id or password'
        });
      } else {
        user.isCorrectPassword(password, function(err, same) {
          if (err) {
            res.status(500)
              .json({
              error: 'Internal error please try again'
            });
          } else if (!same) {
            res.status(401)
              .json({
              error: 'Incorrect id or password'
            });
          } else {
            // Issue token
            const payload = { id };
            const token = jwt.sign(payload, secret, {
              expiresIn: '1h'
            });
            res.cookie('id', id)
            res.cookie('token', token, { httpOnly: true }).sendStatus(200);
          }
        });
      }
    });
  });
  
  app.get('/checkToken', withAuth, function(req, res) {
    res.sendStatus(200);
  });
}