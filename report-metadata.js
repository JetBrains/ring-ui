const tsm = require('teamcity-service-messages');

const messages = require('./metadata-messages.json');

messages.forEach(message => tsm.testMetadata(message));
