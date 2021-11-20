const bcrypt = require('bcrypt');

function passEncrypt(pass) {
  return bcrypt.hash(pass, 10);
}

module.exports = passEncrypt;