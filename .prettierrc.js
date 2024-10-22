module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: false,
  printWidth: 120,
  singleQuote: true,
  overrides: [
    {
      files: ['*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
