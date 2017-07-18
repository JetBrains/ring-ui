const generators = require('yeoman-generator');
const {paramCase, camelCase} = require('change-case');
// We have to use deprecated npm-latest-version package
// because there's no .npmrc in target folder on generator start
const ora = require('ora');
const getFreePort = require('./get-free-port');
const getLatestVersions = require('./get-latest-versions');

const packages = [
  'generator-ring-ui',
  'ring-ui',
  'jetbrains-logos',
  'jetbrains-icons'
];

module.exports = generators.Base.extend({
  prompting() {
    let spinner;

    const prompt = this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'What\'s your project name',
      default: this.appname
    }]).then(answers => {
      spinner = ora('Getting info').start();
      return answers;
    });

    return Promise.all([prompt, getFreePort(), getLatestVersions(packages)]).
      then(([answers, port, versions]) => {
        const projectName = paramCase(answers.projectName);
        const camelCaseName = camelCase(answers.projectName);

        this.props = Object.assign({
          projectName,
          camelCaseName,
          port
        }, versions);
      }).
      then(() => {
        if (spinner) {
          spinner.succeed();
        }
      });
  },

  configuring() {
    this.template('npmrc', '.npmrc');
    this.template('editorconfig', '.editorconfig');
    this.template('gitignore', '.gitignore');
    this.template('eslintignore', '.eslintignore');
    this.template('eslintrc', '.eslintrc');
    this.template('src/eslintrc', 'src/.eslintrc');
  },

  files() {
    this.fs.copyTpl(
      this.templatePath('*.{json,js}'),
      this.destinationPath(''),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('src/**/*'),
      this.destinationPath('src/'),
      this.props
    );
  },

  install() {
    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install']
    });
  }
});
