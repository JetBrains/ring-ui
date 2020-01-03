module.exports = {
  stories: [
    // Make welcome stories default
    '../components/welcome.examples.js',
    '../components/**/*.examples.js'
  ],
  presets: [require.resolve('./custom-header/header-preset')],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-notes',
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y'
  ]
};
