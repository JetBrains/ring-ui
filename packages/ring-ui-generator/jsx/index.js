var generators = require('yeoman-generator');

var convertToBemName = function (name) {
  return name.replace(/-./g, function (symbol) {
    return symbol.replace('-', '').toUpperCase();
  });
};

module.exports = generators.Base.extend({

  writing: function () {
    this.prompt([{
      type: 'input',
      name: 'componentName',
      message: 'What\'s your component name, ' + 'my-component'.green + ' for example',
      default: this.appname
    }], function (answers) {
      var bemName = convertToBemName(answers.componentName);

      var path = answers.componentName + '/' + answers.componentName;

      this.fs.copyTpl(
        this.templatePath('/component.jsx'),
        this.destinationPath(path + '.jsx'),
        {componentName: answers.componentName, bemName: bemName}
      );

      this.fs.copyTpl(
        this.templatePath('/component.scss'),
        this.destinationPath(path + '.scss'),
        {componentName: answers.componentName, bemName: bemName}
      );

      this.fs.copyTpl(
        this.templatePath('/component.test.jsx'),
        this.destinationPath(path + '.test.jsx'),
        {componentName: answers.componentName, bemName: bemName}
      );

    }.bind(this));
  }
});
