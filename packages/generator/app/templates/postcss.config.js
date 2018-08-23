module.exports = () => ({
  plugins: [
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
