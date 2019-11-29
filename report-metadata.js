const tsm = require('teamcity-service-messages');

const messages = require('./metadata-messages');

messages.forEach(message => tsm.testMetadata(message));
