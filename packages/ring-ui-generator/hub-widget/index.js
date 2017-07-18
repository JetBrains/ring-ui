const Generator = require('yeoman-generator');
const {paramCase, camelCase} = require('change-case');
const pify = require('pify');
const path = require('path');
const ora = require('ora');
const latest = pify(require('npm-latest-version'));
const getFreePort = require('../app/get-free-port');
const getLatestVersions = require('../app/get-latest-versions');

const packages = [
  'generator-ring-ui',
  'ring-ui',
  'jetbrains-logos',
  'jetbrains-icons'
];
const BASE_GENERATOR_PATH = path.resolve(require.resolve('../app/index'), '../templates');

module.exports = class extends Generator.Base {
  prompting() {
    let spinner;

    const prompt = this.prompt([
      {
        type: 'input',
        name: 'widgetName',
        message: 'What\'s your widget name, i.e. "My first cool widget"',
        default: this.appname
      },
      {
        type: 'input',
        name: 'widgetDescription',
        message: 'Your widget description',
        default: ''
      },
      {
        type: 'input',
        name: 'widgetAuthor',
        message: 'Widget author name, i.e. "Alice <alice@example.com>"',
        default: ''
      },
    ]).then(answers => {
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
        }, answers, versions);
      }).
      then(() => {
        if (spinner) {
          spinner.succeed();
        }
      });
  }

  files() {
    // Hub-widget template files
    this.fs.copyTpl(
      this.templatePath('*.{json,js}'),
      this.destinationPath(''),
      this.props
    );

    // Base generator files
    this.fs.copyTpl(
      this.templatePath(path.join(BASE_GENERATOR_PATH, '*.{json,js}')),
      this.destinationPath(''),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath(path.join(BASE_GENERATOR_PATH, 'src/**/*')),
      this.destinationPath('src/'),
      this.props
    );
  }

  _copyTemplate(src, dst) {
    this.fs.copyTpl(
      this.templatePath(require.resolve('../app/templates/' + src)),
      this.destinationPath(dst)
    );
  }

  configuring() {
    this._copyTemplate('npmrc', '.npmrc');
    this._copyTemplate('eslintrc', '.eslintrc');
    this._copyTemplate('editorconfig', '.editorconfig');
    this._copyTemplate('gitignore', '.gitignore');
  }

  install() {
    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install']
    });
  }
};
