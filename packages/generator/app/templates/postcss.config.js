module.exports = ctx => ({
  plugins: [
    require('postcss-import'),
    require('postcss-preset-env')({
      features: {
        stage: 3, // See https://cssdb.org/#staging-process
        importFrom: require.resolve(__dirname, '@jetbrains/ring-ui/components/global/variables.css'),
        features: {
          'nesting-rules': true,
          'custom-properties': {
            preserve: true
          }
        }
      }
    })
  ]
});
