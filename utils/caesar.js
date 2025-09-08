// utils/caesar.js
// NOTE: This follows your spec: passwords encrypted with a Caesar cipher (custom shift formula).
// ⚠️ Security note: Caesar ciphers are NOT secure for real-world passwords, but implemented here per requirements.


const crypto = require('crypto');


// Alphabet includes letters, digits, and common symbols to preserve characters while shifting
const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]|:;\"\' + "<>,.?/`~ ";
const N = ALPHABET.length; // size of alphabet


function computeShift(username, salt) {
const hash = crypto.createHash('sha256').update(`${username}:${salt}`).digest('hex');
// Convert a portion of the hash to an integer and mod by N
const num = parseInt(hash.slice(0, 8), 16);
const shift = (num % (N - 1)) + 1; // ensure non-zero shift
return shift;
}


function encrypt(plain, username, salt) {
const k = computeShift(username, salt);
let out = '';
for (const ch of plain) {
const idx = ALPHABET.indexOf(ch);
if (idx === -1) {
out += ch; // leave unknown chars as-is
} else {
out += ALPHABET[(idx + k) % N];
}
}
return out;
}


function decrypt(cipher, username, salt) {
const k = computeShift(username, salt);
let out = '';
for (const ch of cipher) {
const idx = ALPHABET.indexOf(ch);
if (idx === -1) {
out += ch;
} else {
out += ALPHABET[(idx - k + N) % N];
}
}
return out;
}


module.exports = { encrypt, decrypt, computeShift };
