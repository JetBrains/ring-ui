module.exports = ctx => ({
  plugins: [
    require('postcss-modules-values-replace')({}),
    require('postcss-cssnext')({
      features: {
        calc: {
          mediaQueries: true
        },
        customProperties: false
      }
    })
  ]
});
