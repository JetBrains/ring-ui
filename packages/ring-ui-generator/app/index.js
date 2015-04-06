var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

    writing: function () {
        this.prompt([{
            type    : 'input',
            name    : 'projectName',
            message : 'What\'s your project name',
            default: this.appname
        },{
            type    : 'confirm',
            name    : 'useReact',
            message : 'Do you want to use React?'
        },{
            type    : 'confirm',
            name    : 'useAngular',
            message : 'Do you want to use angular?'
        }], function (answers) {

            this.fs.copyTpl(
                this.templatePath('/src/**/*'),
                this.destinationPath('/src/'),
                answers
            );

            this.fs.copyTpl(
                this.templatePath('/*.+(json|js)'),
                this.destinationPath('/'),
                answers
            );

            this._copyUtilFiles();
        }.bind(this));
    },

    _copyUtilFiles: function () {
        this.template('npmrc', '.npmrc');
        this.template('editorconfig', '.editorconfig');
        this.template('gitattributes', '.gitattributes');
        this.template('gitignore', '.gitignore');
    }
});
