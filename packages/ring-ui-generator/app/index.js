const generators = require('yeoman-generator');
const changeCase = require('change-case');
const findPort = require('find-port')

module.exports = generators.Base.extend({
  promt: function () {
    const cb = this.async();

    this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'What\'s your project name',
      default: this.appname
    }]).then(answers => {
      findPort('127.0.0.1', 9010, 9100, ([port]) => {
        console.log(port);
        const projectName = changeCase.paramCase(answers.projectName);
        const camelCaseName = changeCase.camelCase(answers.projectName);
        this.props = {projectName, camelCaseName, port};
        cb();
      });
    });
  },

  files: function () {
    this.fs.copyTpl(
      this.templatePath('src/**/*'),
      this.destinationPath('src/'),
      this.props
    );

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

  install: function () {
    this.npmInstall([
      'ring-ui',
      'jetbrains-logos',
      'jetbrains-icons',
    ], { 'save': true });

    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install']
    });
  }
});
