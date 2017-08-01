const path = require('path');

const Generator = require('yeoman-generator');
const {paramCase, camelCase} = require('change-case');
const ora = require('ora');

const getFreePort = require('../app/get-free-port');
const getLatestVersions = require('../app/get-latest-versions');

const packages = [
  '@jetbrains/generator-ring-ui',
  '@jetbrains/ring-ui',
  '@jetbrains/logos',
  '@jetbrains/icons',
  'hub-dashboard-addons'
];
const BASE_GENERATOR_PATH = path.resolve(
  require.resolve('../app/index'),
  '../templates'
);

const additionalDevServerOptions = `
    headers: {
      'Access-Control-Allow-Origin': '*'
    },`;

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
      }
    ]).then(answers => {
      spinner = ora('Getting info').start();
      return answers;
    });

    return Promise.all([prompt, getFreePort(), getLatestVersions(packages)]).
      then(([answers, port, versions]) => {
        const projectName = paramCase(answers.widgetName);
        const camelCaseName = camelCase(answers.widgetName);

        this.props = Object.assign({
          projectName,
          camelCaseName,
          additionalDevServerOptions,
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

    // Hub-widget sources
    this.fs.copyTpl(
      this.templatePath('src/**/*'),
      this.destinationPath('src/'),
      this.props
    );

    // Base generator files
    this.fs.copyTpl(
      this.templatePath(path.join(BASE_GENERATOR_PATH, '*.{json,js}')),
      this.destinationPath(''),
      this.props
    );

    // Modify package.json – add hub-dashboard-addons
    this.fs.copy(
      this.destinationPath('package.json'),
      this.destinationPath('package.json'),
      {
        process: content => {
          const pkg = JSON.parse(content);

          pkg.config.components = './src';

          pkg.dependencies['hub-dashboard-addons'] =
            this.props.hubDashboardAddons;

          const SPACES = 2;
          return JSON.stringify(pkg, null, SPACES);
        }
      }
    );
  }

  _copyTemplate(src, dst) {
    this.fs.copyTpl(
      this.templatePath(require.resolve(`../app/templates/${src}`)),
      this.destinationPath(dst)
    );
  }

  configuring() {
    this._copyTemplate('editorconfig', '.editorconfig');
    this._copyTemplate('gitignore', '.gitignore');
    this._copyTemplate('eslintignore', '.eslintignore');
    this._copyTemplate('eslintrc', '.eslintrc');
    this._copyTemplate('src/eslintrc', 'src/.eslintrc');
  }

  install() {
    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install']
    });
  }
};
