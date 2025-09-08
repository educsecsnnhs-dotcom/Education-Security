// utils/auth.js
const jwt = require('jsonwebtoken');


function signToken(user) {
return jwt.sign(
{ id: user._id, username: user.username, roles: user.roles },
process.env.JWT_SECRET,
{ expiresIn: '7d' }
);
}


function verifyToken(token) {
return jwt.verify(token, process.env.JWT_SECRET);
}


module.exports = { signToken, verifyToken };
