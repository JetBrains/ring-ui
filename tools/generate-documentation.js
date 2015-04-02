/* eslint-env node */
var path = require('path');
var Dgeni = require('dgeni');
var Package = Dgeni.Package;

var LogLevel = {
  INFO: 'info'
};

var dgeni = new Dgeni([

  /**
   * All configuration take place
   * through creating project specific package
   */
  new Package('dgeni-example', [
    require('dgeni-packages/jsdoc'),
    require('dgeni-packages/examples'),
    require('dgeni-packages/nunjucks')
  ])

  .processor(require('./webpack-examples-processor'))

  .processor(function inlineExampleToDoc(exampleMap) {
    return {
      $runAfter: ['parseExamplesProcessor'],
      $runBefore: ['renderDocsProcessor'],
      $process: function(docs) {
        exampleMap.forEach(function(example) {
          this._addExampleToDoc(example);
        }.bind(this));

        return docs;
      },
      _addExampleToDoc: function(example) {
        var doc = example.doc;
        doc.examples = doc.examples || [];
        doc.examples.push(example);
      }
    };
  })

  .processor(function joinDocsToComponent() {
    return {
      $runAfter: ['parseExamplesProcessor'],
      $runBefore: ['computeIdsProcessor'],
      $process: function(docs) {
        var exampleDocs = docs.filter(function(doc) {
          return doc.docType !== 'js';
        });
        var createGroup = function(doc) {
          doc.name = doc.fileInfo.baseName;
          doc.components = [];
          return doc;
        };

        var componentsMap = docs.filter(function(doc) {
          return doc.docType === 'js';
        }).reduce(function(componentGroups, doc) {
          var groupId = doc.fileInfo.filePath;
          componentGroups[groupId] = componentGroups[groupId] || createGroup(doc);
          componentGroups[groupId].components.push(doc);
          return componentGroups;
        }, {});

        var components = Object.keys(componentsMap).map(function(groupId) {
          return componentsMap[groupId];
        });

        return components.concat(exampleDocs);
      }
    };
  })

  /**
   * @description Transform jsx file to js
   * @param {Object} jsddocFileReader
   * @return {Object} The jsx file reader
   */
  .factory(function jsxFileReader(jsdocFileReader) {
    return {
      name: 'jsxFileReader',
      defaultPattern: /\.jsx$/,
      getDocs: function(fileInfo) {
        fileInfo.content = require('react-tools').transform(fileInfo.content);
        return jsdocFileReader.getDocs(fileInfo);
      }
    };
  })

  /**
   * Configure dgeni packages
   */
  .config(function(log, readFilesProcessor, templateFinder, writeFilesProcessor, generateExamplesProcessor, generateProtractorTestsProcessor, jsxFileReader) {
    log.level = LogLevel.INFO;

    /**
     * Reading source files
     */
    readFilesProcessor.fileReaders.unshift(jsxFileReader);
    readFilesProcessor.basePath = path.resolve(__dirname, '..', 'components');
    var readFileFilter = process.argv[2];

    if (readFileFilter){
      console.log('Generate documentation only for', readFileFilter);
    }

    readFilesProcessor.sourceFiles = readFileFilter ? ['**/**/' + readFileFilter] : [
      './**/*.jsx',
      './react-ng/react-ng.js',
      './tabs-ng/tabs-ng.js',
      './select-ng/select-ng.js',
      './breadcrumb-ng/breadcrumb-ng.js',
      './sidebar-ng/sidebar-ng.js',
      './table-ng/table-ng.js',
      './analytics-ng/analytics-ng.js',
      './error-page-ng/error-page-ng.js',
      './dropdown-ng/dropdown-ng.js'
    ];

    /**
     * Add folder to search for our own templates to use
     * when redering docs
     */
    templateFinder.templateFolders.unshift(
      path.resolve(__dirname, '..', 'templates'));

    templateFinder.templatePatterns = [
      '<%= doc.template %>',
      '<%= doc.docType %>.template',
      'common.template.html'
    ];

    writeFilesProcessor.outputFolder = '../docs';

    generateProtractorTestsProcessor.$enabled = false;
    generateExamplesProcessor.deployments = [{
      name: 'testDeployment',
      examples: {
        commonFiles: {
          scripts: ['']
        },
        dependencyPath: ''
      },
      scripts: [],
      stylesheets: []
    }];
  })
]);

dgeni.generate();
