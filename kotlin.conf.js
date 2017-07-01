const path = require('path');

const moduleName = 'kotlin-ring-ui';

module.exports = {
  src: path.join(__dirname, 'components'),
  output: path.join(__dirname, moduleName, 'build'),
  moduleName,
  libraries: [
    '@hypnosphi/kotlin-extensions',
    '@hypnosphi/kotlin-react',
    '@hypnosphi/kotlin-react-dom',
    '@hypnosphi/kotlinx-html-js'
  ].map(pkg => require.resolve(pkg))
};
