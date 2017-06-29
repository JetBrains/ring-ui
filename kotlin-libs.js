module.exports = {
  libraries: [
    '@hypnosphi/kotlin-extensions',
    '@hypnosphi/kotlin-react',
    '@hypnosphi/kotlin-react-dom',
    '@hypnosphi/kotlinx-html-js'
  ].map(pkg => require.resolve(pkg))
};
