module.exports = (props, packageJson) => Object.assign(
  {name: props.projectName},
  packageJson,
  {
    dependencies: Object.assign({
      '@jetbrains/icons': props.jetbrainsIcons,
      '@jetbrains/logos': props.jetbrainsLogos,
      '@jetbrains/ring-ui': props.jetbrainsRingUi
    }, packageJson.dependencies),
    devDependencies: Object.assign({
      '@jetbrains/generator-ring-ui': props.jetbrainsGeneratorRingUi
    }, packageJson.devDependencies)
  }
);
