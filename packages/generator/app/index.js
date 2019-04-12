const Generator = require('yeoman-generator');
const {paramCase, camelCase} = require('change-case');
// We have to use deprecated npm-latest-version package
// because there's no .npmrc in target folder on generator start
const ora = require('ora');

const getFreePort = require('./get-free-port');
const getLatestVersions = require('./get-latest-versions');
const processPackageJson = require('./process-package-json');

const packages = [
  '@jetbrains/generator-ring-ui',
  '@jetbrains/logos'
];

const INDENT = 2;

module.exports = class AppGenerator extends Generator {
  constructor(...args) {
    super(...args);

    this.argument('projectName', {type: String, required: false});
  }

  prompting() {
    let spinner;

    const prompt = this.options.projectName
      ? Promise.resolve({
        projectName: this.options.projectName
      })
      : this.prompt([{
        type: 'input',
        name: 'projectName',
        message: 'What\'s your project name',
        default: this.appname
      }]);

    prompt.then(() => {
      spinner = ora('Getting info').start();
    });

    return Promise.all([prompt, getFreePort(), getLatestVersions(packages)]).
      then(([answers, port, versions]) => {
        const projectName = paramCase(answers.projectName);
        const camelCaseName = camelCase(answers.projectName);

        this.props = Object.assign({
          projectName,
          camelCaseName,
          port,
          additionalDevServerOptions: '',
          additionalWebpackPlugins: ''
        }, versions);
      }).
      then(() => {
        if (spinner) {
          spinner.succeed();
        }
      });
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

  files() {
    this.fs.copyTpl(
      this.templatePath('*.{json,js}'),
      this.destinationPath(''),
      this.props
    );

    this.fs.copy(
      this.destinationPath('package.json'),
      this.destinationPath('package.json'),
      {
        process: content => {
          const packageJson = processPackageJson(
            this.props,
            JSON.parse(content)
          );
          return JSON.stringify(packageJson, null, INDENT);
        }
      }
    );

    this.fs.copyTpl(
      this.templatePath('src/**/!(eslintrc)'),
      this.destinationPath('src/'),
      this.props
    );
  }

  install() {
    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install']
    });
  }
};
