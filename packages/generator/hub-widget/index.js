const path = require('path');

const Generator = require('yeoman-generator');
const optionOrPrompt = require('yeoman-option-or-prompt');
const {paramCase, camelCase} = require('change-case');

const getFreePort = require('../app/get-free-port');
const getLatestVersions = require('../app/get-latest-versions');
const processPackageJson = require('../app/process-package-json');

const packages = [
  '@jetbrains/ring-ui',
  '@jetbrains/logos',
  '@jetbrains/icons',
  '@jetbrains/generator-ring-ui',
  '@jetbrains/hub-widget-ui',
  'hub-dashboard-addons'
];
const BASE_GENERATOR_PATH = path.resolve(
  require.resolve('../app/index'),
  '../templates'
);

const INDENT = 2;

const additionalDevServerOptions = `
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    allowedHosts: 'all'`;

const additionalWebpackPlugins = `,
    new (require('copy-webpack-plugin'))({patterns: ['manifest.json']}, {})
`;

module.exports = class HubWidgetGenerator extends Generator {
  prompting() {
    let spinner;

    const prompt = optionOrPrompt.call(this, [
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
    ]).then(async answers => {
      const {default: ora} = await import('ora');
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
          additionalWebpackPlugins,
          port
        }, answers, versions);

        console.log('Generating package with given parameters:', this.props);
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
      this.templatePath('*.{json,js,md}'),
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
          const packageJson = processPackageJson(
            this.props,
            JSON.parse(content)
          );
          const newPackageJson = Object.assign({}, packageJson, {
            config: Object.assign({}, packageJson.config, {
              components: './src'
            }),
            dependencies: Object.assign({}, packageJson.dependencies, {
              'hub-dashboard-addons': this.props.hubDashboardAddons,
              '@jetbrains/hub-widget-ui': this.props.jetbrainsHubWidgetUi
            }),
            scripts: Object.assign({}, packageJson.scripts, {
              build: 'webpack --mode=production', // Widgets with sourcemaps take to much space
              dist: `npm run build && rm -f ${this.props.projectName}.zip && zip -r -j ${this.props.projectName}.zip ./dist`
            })
          });
          return JSON.stringify(newPackageJson, null, INDENT);
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
};
