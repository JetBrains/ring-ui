const generators = require('yeoman-generator');
const changeCase = require('change-case');

module.exports = generators.Base.extend({

  writing: function () {
    this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'What\'s your project name',
      default: this.appname
    }]).then(answers => {
      const projectName = changeCase.paramCase(answers.projectName);

      this.fs.copyTpl(
        this.templatePath('src/**/*'),
        this.destinationPath('src/'),
        {projectName}
      );

      this.fs.copyTpl(
        this.templatePath('*.{json,js}'),
        this.destinationPath(''),
        {projectName}
      );

      this._copyUtilFiles();
    });
  },

  _copyUtilFiles: function () {
    this.template('npmrc', '.npmrc');
    this.template('editorconfig', '.editorconfig');
    this.template('gitignore', '.gitignore');
    this.template('eslintignore', '.eslintignore');
    this.template('eslintrc', '.eslintrc');
  }
});
