// config/google.js
const { google } = require('googleapis');


function getGoogleAuth() {
const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is missing');
const creds = typeof raw === 'string' ? JSON.parse(raw) : raw;


const scopes = [
'https://www.googleapis.com/auth/spreadsheets',
'https://www.googleapis.com/auth/drive.readonly'
];


const auth = new google.auth.JWT({
email: creds.client_email,
key: creds.private_key,
scopes
});


return auth;
}


async function getSheetsClient() {
const auth = getGoogleAuth();
await auth.authorize();
return google.sheets({ version: 'v4', auth });
}


module.exports = { getSheetsClient };
