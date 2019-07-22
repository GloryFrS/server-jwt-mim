const mongoose = require('mongoose');
const config = require('config');

 module.exports = () => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.set('debug', true);

    mongoose.connection
      .on('error', (error) => {
        console.log('ERROR *** No connect to server databases');
        reject(error);
      })
      .on('close', () => {
        console.log('INFO *** Connection closed');
      })
      .on('open', () => {
        resolve(mongoose.connection[0]);
        console.log('INFO *** Connected success!')
      });
    mongoose.connect(config.app.dbConfig.url, config.app.dbConfig.options);
  })
};