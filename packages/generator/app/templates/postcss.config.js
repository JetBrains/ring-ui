module.exports = ctx => ({
  plugins: [
    require('postcss-import'),
    require('postcss-cssnext')({
      features: {
        calc: {
          mediaQueries: true
        },
        customProperties: {
          preserve: true,
          variables: ctx.options.variables
        }
      }
    })
  ]
});
