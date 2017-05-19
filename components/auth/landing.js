import ResponseParser from './response-parser';

const parser = new ResponseParser();

const authResponse = parser.getAuthResponseFromURL();

// eslint-disable-next-line no-console
console.log('authResponse', authResponse);
