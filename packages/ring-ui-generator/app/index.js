/* eslint-disable modules/no-cjs */

const generators = require('yeoman-generator');
const {paramCase, camelCase} = require('change-case');
const pify = require('pify');
const {findAPortNotInUse} = pify(require('portscanner'));
// We have to use deprecated npm-latest-version package
// because there's no .npmrc in target folder on generator start
const latest = pify(require('npm-latest-version'));
const ora = require('ora');

const PORT_RANGE_START = 9010;
const PORT_RANGE_END = 9100;
const REGISTRY_URL = 'http://registry.npmjs.org';
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

    const portPromise = findAPortNotInUse(PORT_RANGE_START, PORT_RANGE_END, '127.0.0.1');
    const packagesPromises = Promise.all(packages.map(packageName => latest(packageName, {base: REGISTRY_URL}))).
      then(latestVersions => {
        const versions = {};
        packages.forEach((packageName, i) => {
          versions[camelCase(packageName)] = latestVersions[i];
        });
        return versions;
      });

    return Promise.all([prompt, portPromise, packagesPromises]).then(([answers, port, versions]) => {
      const projectName = paramCase(answers.projectName);
      const camelCaseName = camelCase(answers.projectName);

      this.props = Object.assign({projectName, camelCaseName, port}, versions);
    }).then(() => {
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
