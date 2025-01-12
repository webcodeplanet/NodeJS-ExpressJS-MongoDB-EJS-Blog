const path = require('path');

const myPath = (page) => path.resolve(__dirname,'../views', `${page}.ejs`);

module.exports = myPath;