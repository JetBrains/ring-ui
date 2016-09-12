const generators = require('yeoman-generator');
const green = require('chalk').green;
const format = require('util').format;
const path = require('path');
const changeCase = require('change-case');
const readPkgUp = require('read-pkg-up');

const RING_UI_PACKAGE = 'ring-ui';
const RING_UI_CLASS_PREFIX = 'ring-';
const RING_UI_DIRECTIVE_PREFIX = 'rg';
const RING_UI_NG_SUFFIX = ' Ng';
const COMPONENT_DEFAULT_FILENAME = 'component';

module.exports = params => generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.argument('componentName', {type: String, required: false});
  },

  writing: function () {
    const pkg = readPkgUp();
    const promptParams = [{
      type: 'input',
      name: 'componentName',
      message: params.promptMessage || 'What\'s your component name is any case, ' + green('my component') + ' for example',
      default: this.appname
    }];

    const prompt = this.componentName ?
      Promise.resolve({componentName: this.componentName})
      : this.prompt(promptParams);

    Promise.all([pkg, prompt]).then(results => {
      const pkg = results[0].pkg;
      const ringUIPath = results[0].path;
      const answers = results[1];

      const isRingUI = pkg && pkg.name === RING_UI_PACKAGE;
      const isRingUINg = isRingUI && params.type === 'angular';

      const componentName = answers.componentName;
      const camelCaseName = changeCase.camelCase(componentName);
      const paramCaseName = changeCase.paramCase(componentName);
      const componentNameSuffix = isRingUINg ? componentName + RING_UI_NG_SUFFIX : componentName;
      const paramCaseNameSuffix = changeCase.paramCase(componentNameSuffix);

      const componentPath = path.join(process.cwd(), paramCaseNameSuffix);

      const ringUIComponentsPath = path.relative(componentPath, path.join(path.dirname(ringUIPath), 'components'));
      const ringUIRoot = isRingUI ? ringUIComponentsPath : `${RING_UI_PACKAGE}/components`;
      const ringUIRootSass = isRingUI ? ringUIRoot : '~' + RING_UI_PACKAGE;

      const className = isRingUI ? RING_UI_CLASS_PREFIX + paramCaseName : paramCaseName;
      const pascalCaseName = changeCase.pascalCase(componentName);
      const titleCaseName = changeCase.titleCase(componentNameSuffix);
      const ngDirectiveName = isRingUI
        ? RING_UI_DIRECTIVE_PREFIX + pascalCaseName
        : camelCaseName;
      const ngDirectiveTagName = isRingUI
        ? RING_UI_DIRECTIVE_PREFIX + '-' + paramCaseName
        : paramCaseName;

      const templateContext = {
        camelCaseName,
        className,
        ngDirectiveName,
        ngDirectiveTagName,
        pascalCaseName,
        paramCaseName,
        paramCaseNameSuffix,
        ringUIRoot,
        ringUIRootSass,
        titleCaseName,
      };

      params.fileTemplates.forEach(template => {
        this.fs.copyTpl(
          this.templatePath(format(template, COMPONENT_DEFAULT_FILENAME)),
          this.destinationPath(path.join(paramCaseNameSuffix, format(template, paramCaseNameSuffix))),
          templateContext
        );
      });
    })
  }
});
