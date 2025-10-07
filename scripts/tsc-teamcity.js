const tsm = require('teamcity-service-messages');

tsm.autoFlowId = false;

const errorFormat = /^(.+)\((\d+),\d+\): error (TS\d+): (.*)+$/m;
const origWrite = process.stdout.write;
const registeredErrorCodes = new Set();
process.stdout.write = function write(error, ...args) {
  const match = error.match(errorFormat);
  if (match) {
    const [_, file, line, errorCode, message] = match;
    if (!registeredErrorCodes.has(errorCode)) {
      tsm.inspectionType({
        id: errorCode,
        name: errorCode,
        category: 'TypeScript errors',
        description: 'Errors reported by TypeScript',
      });
      registeredErrorCodes.add(errorCode);
    }
    tsm.inspection({typeId: errorCode, file, line, message});
  }
  return origWrite.apply(this, args);
};
process.argv.push('--pretty', 'false');

require('typescript/lib/tsc');
