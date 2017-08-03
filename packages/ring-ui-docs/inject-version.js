const fs = require('fs');

const ringPkg = require('@jetbrains/ring-ui/package.json');

fs.writeFileSync('dist/version.js', `window.version = '${ringPkg.version}';`);
