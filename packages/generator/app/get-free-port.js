/* eslint-disable no-param-reassign */
const pify = require('pify');
const {findAPortNotInUse} = pify(require('portscanner'));

const PORT_RANGE_START = 9010;
const PORT_RANGE_END = 9100;

module.exports = (startPort, endPort) => findAPortNotInUse(
  startPort || PORT_RANGE_START,
  endPort || PORT_RANGE_END,
  '127.0.0.1'
);
