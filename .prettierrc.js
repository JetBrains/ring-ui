export default {
  arrowParens: 'avoid',
  bracketSpacing: false,
  printWidth: 120,
  singleQuote: true,
  jsxSingleQuote: true,
  overrides: [
    {
      files: ['*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
