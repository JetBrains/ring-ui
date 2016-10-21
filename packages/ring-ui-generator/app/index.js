/* eslint-disable modules/no-cjs */

const generators = require('yeoman-generator');
const changeCase = require('change-case');
const findPort = require('find-port');
const pkg = require('../package.json');

const PORT_RANGE_START = 9010;
const PORT_RANGE_END = 9100;

module.exports = generators.Base.extend({
  prompting() {
    const cb = this.async();

    this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'What\'s your project name',
      default: this.appname
    }]).then(answers => {
      findPort('127.0.0.1', PORT_RANGE_START, PORT_RANGE_END, ([port]) => {
        const {version} = pkg;
        const projectName = changeCase.paramCase(answers.projectName);
        const camelCaseName = changeCase.camelCase(answers.projectName);

        this.props = {projectName, camelCaseName, port, version};
        cb();
      });
    });
  },

  configuring() {
    this.fs.copyTpl(
      this.templatePath('*.{json,js}'),
      this.destinationPath(''),
      this.props
    );

    this.template('npmrc', '.npmrc');
    this.template('editorconfig', '.editorconfig');
    this.template('gitignore', '.gitignore');
    this.template('eslintignore', '.eslintignore');
    this.template('eslintrc', '.eslintrc');
  },

  files() {
    this.fs.copyTpl(
      this.templatePath('src/**/*'),
      this.destinationPath('src/'),
      this.props
    );
  },

  install() {
    this.npmInstall([
      'ring-ui',
      'jetbrains-logos',
      'jetbrains-icons'
    ], {save: true});

    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install']
    });
  }
});
