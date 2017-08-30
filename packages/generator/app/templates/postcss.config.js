module.exports = ctx => ({
  plugins: [
    require('postcss-modules-values-replace')({
      fs: ctx.webpack._compiler.inputFileSystem
    }),
    require('postcss-cssnext')({
      features: {
        calc: {
          mediaQueries: true
        }
      }
    })
  ]
});
