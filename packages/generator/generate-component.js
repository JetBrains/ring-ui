const format = require('util').format;
const path = require('path');

const Generator = require('yeoman-generator');
const green = require('chalk').green;
const changeCase = require('change-case');
const {titleCase} = require('title-case');

const RING_UI_PACKAGE = '@jetbrains/ring-ui';
const RING_UI_CLASS_PREFIX = 'ring-';
const RING_UI_DIRECTIVE_PREFIX = 'rg';
const RING_UI_NG_SUFFIX = ' Ng';
const COMPONENT_DEFAULT_FILENAME = 'component';

module.exports = params => class ComponentGenerator extends Generator {
  constructor(...args) {
    super(...args);

    this.argument('componentName', {type: String, required: false});
    this.option('path', {
      type: String,
      required: false,
      default: process.cwd()
    });
  }

  async prompting() {
    const {readPackageUp} = await import('read-pkg-up');
    const pkgFile = await readPackageUp();
    const promptParams = [{
      type: 'input',
      name: 'componentName',
      message: params.promptMessage || `What's your component name is any case, ${green('my component')} for example`,
      default: this.appname
    }];

    const prompt = this.options.componentName
      ? Promise.resolve({componentName: this.options.componentName})
      : this.prompt(promptParams);

    // eslint-disable-next-line complexity
    await Promise.all([pkgFile, prompt]).then(results => {
      this.answers = {
        pkg: results[0].packageJson,
        path: results[0].path,
        componentName: results[1].componentName
      };
    });
  }

  // eslint-disable-next-line complexity
  writing() {
    const pkg = this.answers.pkg;
    const ringUIPath = this.answers.path;

    const isRingUI = pkg && pkg.name === RING_UI_PACKAGE;
    const isRingUINg = isRingUI && params.type === 'angular';

    const componentName = this.answers.componentName;
    const camelCaseName = changeCase.camelCase(componentName);
    const paramCaseName = changeCase.paramCase(componentName);
    const componentNameSuffix = isRingUINg
      ? componentName + RING_UI_NG_SUFFIX
      : componentName;
    const paramCaseNameSuffix = changeCase.paramCase(componentNameSuffix);
    const componentPath = path.join(this.options.path, paramCaseNameSuffix);

    const ringUIComponentsPath = path.relative(
      componentPath,
      path.join(path.dirname(ringUIPath), 'components')
    );
    const ringUIRoot = isRingUI ? ringUIComponentsPath : `${RING_UI_PACKAGE}/components`;

    const className = isRingUI
      ? RING_UI_CLASS_PREFIX + paramCaseName
      : paramCaseName;
    const pascalCaseName = changeCase.pascalCase(componentName);
    const titleCaseName = titleCase(componentNameSuffix);
    const ngComponentName = isRingUI
      ? RING_UI_DIRECTIVE_PREFIX + pascalCaseName
      : camelCaseName;
    const ngDirectiveTagName = isRingUI
      ? `${RING_UI_DIRECTIVE_PREFIX}-${paramCaseName}`
      : paramCaseName;

    const templateContext = {
      camelCaseName,
      className,
      ngComponentName,
      ngDirectiveTagName,
      pascalCaseName,
      paramCaseName,
      paramCaseNameSuffix,
      ringUIRoot,
      titleCaseName
    };

    params.fileTemplates.forEach(template => {
      if (typeof template === 'string' || template.ringUI === isRingUI) {
        const templateString = template.template || template;

        this.fs.copyTpl(
          this.templatePath(format(
            templateString,
            COMPONENT_DEFAULT_FILENAME
          )),
          this.destinationPath(path.join(componentPath, format(
            templateString,
            paramCaseNameSuffix
          ))),
          templateContext
        );
      }
    });
  }
};
