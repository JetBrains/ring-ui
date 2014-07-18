/*jshint scripturl:true*/
var hljs = require('highlight.js');
var _ = require('lodash');

var LIVERELOAD_PORT = 35730;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var path = {
    dist: 'dist/',
    blocks: 'blocks/',
    bundles: 'bundles/',
    docs: 'docs/',
    tmp:  'tmp/',
    jshintreport: 'tmp/jshintreport.xml',
    shims: 'shims/',
    tests: 'test/'
  };

  var requireConfig = {
    options: {
      baseUrl: 'blocks',
      name: '../components/almond/almond',
      mainConfigFile: path.bundles + 'ring.config.js',
      include: 'ring',
      out: path.dist + 'ring.js',
      optimize: 'none',
      generateSourceMaps: true,
      wrap: {
        startFile: path.bundles + 'ring-start.frag',
        endFile: path.bundles + 'ring-end.frag'
      }
    }
  };

  // FIXME Convert to grunt task
  // All of this just because of:
  // * spawn: false
  // * https://github.com/gruntjs/grunt-contrib-watch/issues/231
  var watchConfig = {};
  var args = process.argv.join(':').split(':');
  if (args.indexOf('server') !== -1) {
    grunt.util.spawn({
      grunt: true,
      args: ['watch']
    });

    grunt.log.writeln('Add :styleguide target to livereload styleguide generated files');
    grunt.log.writeln('Add :test target to run test on file changes');

    watchConfig = {
      options: {
        livereload: false,
        spawn: false
      },
      styles: {
        files: ['<%= path.blocks %>**/*.scss', '<%= path.bundles %>**/*.scss', '<%= path.blocks %>**/*.md'],
        tasks: args.indexOf('styleguide') !== -1 ? ['styles', 'styleguide'] : ['styles']
      },
      js: {
        files: ['<%= path.blocks %>**/*.js', '<%= path.bundles %>**/*.js', '<%= path.tests %>**/*.js'],
        tasks: args.indexOf('test') !== -1 ? ['jshint:dev', 'karma:dev:run'] : ['jshint:dev']
      },
      components: {
        files: ['<%= path.blocks %>**/*.{ng.*,scss}'],
        tasks: ['copy:blocks']
      },
      markdown: {
        files: ['<%= path.docs %>**/*.md'],
        tasks: ['docs']
      },
      templates: {
        files: ['<%= path.blocks %>**/*.hbs'],
        tasks: ['templates']
      }
    };
  } else {
    watchConfig = {
      options: {
        livereload: LIVERELOAD_PORT,
        spawn: false
      },
      page: {
        tasks: ['notify:page'],
        files: ['{,<%= path.dist %>}{,*/}*.html']
      },
      styles: {
        tasks: ['notify:styles'],
        files: ['<%= path.dist %>{,*/}*.css']
      },
      scripts: {
        tasks: ['notify:scripts'],
        files: ['{<%= path.blocks %>,<%= path.temp %>,<%= path.dist %>}{,*/}*.js']
      }
    };
  }

  var pkg = grunt.file.readJSON('package.json');

  // Set version option form build option
  (function(option) {
    var DELIM = '.';

    var ver = pkg.version.split(DELIM);
    var oldVer = ver.pop();
    ver.push(option('build') || process.env['BUILD_NUMBER'] || ++oldVer);

    option('setversion', ver.join(DELIM));
  }(grunt.option));

  grunt.initConfig({
    pkg: pkg,
    version: grunt.option('setversion'),
    path: path,

    // Build
    csswring: {
      options: {
        banner: '<%= pkg.name %> <%= version %>',
        preserveHacks: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.dist %>',
          src: ['*.css'],
          ext: '.min.css',
          dest: '<%= path.dist %>'
        }]
      }
    },

    webfont: {
      icons: {
        src: '<%= path.blocks %>/font-icon/__icon/*.svg',
        dest: '<%= path.blocks %>font-icon/',
        options: {
          font: 'font-icon',
          hashes: false,
          types: 'eot,woff,ttf,svg',
          stylesheet: 'scss',
          template: '<%= path.blocks %>/font-icon/font-icon.tpl.css',
          htmlDemo: false
        }
      }
    },

    //this plugin desn't support glob patterns
    'svg-sprites': {
      'ring-logos': {
        options: {
          name: 'ring-logo__',
          prefix: '',
          //spriteElementPath: '<%= path.blocks %>logos2/source',
          spriteElementPath: 'blocks/logos/source',
          spritePath: 'blocks/logos',
          layout: 'vertical',
          cssPath: 'blocks/logos',
          cssSuffix: 'scss',
          //cssUnit: 'rem',
          cssSvgPrefix: '.ring-logo',
          sizes: {
            16: 16,
            24: 24,
            32: 32,
            64: 64,
            128: 128,
            256: 256
          },
          refSize: '24'
        }
      }
    },

    uglify: {
      dist: {
        options: {
          banner: '/* <%= pkg.name %> <%= version %> */',
          sourceMap: true,
          sourceMapName: function(file) {
            return file + '.map';
          },
          sourceMapIn: function(file) {
            return file.split('.')[0] + '.js.map';
          }
        },
        files: [{
          expand: true,
          cwd: '<%= path.dist %>',
          src: '*.js',
          ext: '.min.js',
          dest: '<%= path.dist %>'
        }]
      }
    },
    compress: {
      options: {
        pretty: true
      },
//      component: {
//        options: {
//          archive: './<%= path.dist %><%= pkg.name %>-component.tar.gz'
//        },
//        files: [
//          { expand: true, cwd: '<%= path.dist %>', src: ['**']}
//        ]
//      },
      dist: {
        options: {
          archive: '<%= pkg.name %>-<%= version %>.zip'
        },
        files: [
          { expand: true, cwd: '<%= path.dist %>', src: ['**', '!**.gz'], dest: 'ring'}
        ]
      },
      coverage: {
        options: {
          archive: 'coverage.zip'
        },
        files: [{
          expand: true,
          cwd: '<%= path.tmp %>/coverage/',
          src: ['*/**'],
          dest: '',
          rename: function(dest, matchedSrcPath) {
            // Remove first level dir (e.g. "PhantomJS 1.9.1 (Mac OS X)") from path.
            return matchedSrcPath.replace(/^[^\/]+\//,'./');
          }
        }]
      }
    },
    teamcity: {
      jshint: [
        {
          message: 'importData',
          data: {
            type: 'jslint',
            path: '<%= path.jshintreport %>'
          }
        }
      ]
    },

    // Test
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      dist: {
        singleRun: true,
        browsers: ['Firefox', 'ChromeNoSandbox'],
        reporters: ['teamcity', 'coverage']
      },
      dev: {
        background: true
      },
      test: {
        singleRun: true
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      dev: {
        options: {
          // Don't break watch on jshint warnings
          force: true
        },
        files: {
          src: ['*.js', '<%= path.blocks %>**/*.js', '<%= path.bundles %>*.js', '<%= path.tests %>*.js']
        }
      },
      hook: (process.env['HOOK_FILES'] || '').split('\n'),
      dist: {
        options: {
          reporter: 'jslint',
          reporterOutput: '<%= path.jshintreport %>'
        },
        files: {
          src: ['*.js', '<%= path.blocks %>**/*.js', '<%= path.bundles %>*.js', '<%= path.tests %>*.js']
        }
      }
    },
    githooks: {
      options: {
        // We need grunt absolute path because of IntelliJ
        command: 'node ' + process.argv[1],
        // Custom template to collect committed files
        template: '.pre-commit.js.hbs'
      },
      all: {
        // Will run the jshint and test:unit tasks at every commit
        'pre-commit': 'jshint:hook karma:test'
      }
    },

    // Process
    clean: {
      styles: '<%= path.dist %>/*.css',
      generated: ['<%= path.dist %>', '<%= path.tmp %>', '<%= path.blocks %>**/*.hbs.js'],
      modules: ['node_modules', 'components'],
      hooks: ['.git/hooks/pre-commit']
    },
    bower: {
      install: {
        options: {
          copy: false,
          verbose: true
        }
      }
    },
    sass: {
      dist: {
        options: {
          includePaths: ['<%= path.blocks %>**/'],
// Temporarily disabled because of https://github.com/sass/node-sass/issues/337
//          sourceComments: 'map',
          outputStyle: 'nested'
        },
        files: [{
          expand: true,
          cwd: '<%= path.bundles %>',
          src: '*.scss',
          dest: '<%= path.dist %>',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      options: {
        // Autoprefixer default plus Explorer > 7
        browsers: ['> 1%', 'last 2 versions', 'Opera 12.1', 'Explorer >= 7']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.dist %>',
          src : '*.css',
          dest: '<%= path.dist %>',
          ext: '.css'
        }]
      }
    },
    htmlmin: {
      compile: {
        files: [{
          expand: true,
          cwd: '.',
          src : '<%= path.blocks %>**/*.hbs',
          dest: '<%= path.tmp %>',
          ext: '.hbs'
        }]
      }
    },
    handlebars: {
      compile: {
        options: {
          amd: true,
          namespace: false,
          node: false
        },
        files: [{
          expand: true,
          cwd: '<%= path.tmp %>',
          src : '<%= path.blocks %>**/*.hbs',
          dest: '.',
          ext: '.hbs.js'
        }]
      }
    },
    requirejs: {
      'ring': requireConfig,
      'ring-oauth': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-oauth'
          },
          out: '<%= path.dist %>ring-oauth.js'
        })
      },
      'youtrack-standalone': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>youtrack-standalone'
          },
          out: '<%= path.dist %>youtrack-standalone.js'
        })
      },
      'ring-jetbrains': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-jetbrains'
          },
          out: '<%= path.dist %>ring-jetbrains.js'
        })
      },
      'ring-jetbrains-confluence': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-jetbrains-confluence',
            jquery: '../components/jquery/dist/jquery'
          },
          out: '<%= path.dist %>ring-jetbrains-confluence.js'
        })
      },
      'ring-jetbrains-vc': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-jetbrains-vc',
            jquery: '../components/jquery/dist/jquery'
          },
          out: '<%= path.dist %>ring-jetbrains-vc.js'
        })
      },
      'ring-jetbrains-oauth': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-jetbrains-oauth'
          },
          out: '<%= path.dist %>ring-jetbrains-oauth.js'
        })
      },
      'ring-diff': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-diff'
          },
          out: '<%= path.dist %>ring-diff.js'
        })
      },
      'ring-diff-oauth': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-diff-oauth'
          },
          out: '<%= path.dist %>ring-diff-oauth.js'
        })
      },
      'ring-hub': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-hub'
          },
          out: '<%= path.dist %>ring-hub.js'
        })
      },
      'ring-upsource': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-upsource'
          },
          out: '<%= path.dist %>ring-upsource.js'
        })
      },
      'ring-upsource-oauth': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-upsource-oauth'
          },
          out: '<%= path.dist %>ring-upsource-oauth.js'
        })
      }
    },
    copy: {
      fonts: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            '<%= path.blocks %>**/*.woff',
            '<%= path.blocks %>**/*.eot',
            '<%= path.blocks %>**/*.ttf',
            '<%= path.blocks %>**/*.svg', '!<%= path.blocks %>logos/source/*.svg',
            '<%= path.blocks %>font-icon/*.png',
            '!<%= path.blocks %>**/*.dev.svg'
          ],
          dest: '<%= path.dist %>fonts'
        }]
      },
      blocks: {
        src: '<%= path.blocks %>**/*.{ng.*,scss}',
        dest: '<%= path.dist %>'
      },
      // So ugly, but no other way
      codemirror: {
        src: 'components/codemirror/lib/codemirror.css',
        dest: 'components/codemirror/lib/codemirror.scss'
      }
    },
    markdown: {
      all: {
        files: [
          {
            expand: true,
            cwd: '<%= path.tmp %>',
            src: '**/*.md',
            dest: '<%= path.dist %>',
            ext: '.html'
          }
        ],
        options: {
          markdownOptions: {
            gfm: true,
            highlight: function (code) {
              var lang = ['{','[', '\''].indexOf(code.substr(0,1)) !== -1 ? 'json' : 'javascript';
              return hljs.highlight(lang,code).value;
            }
          }
        }
      }
    },
    toc: {
      all: {
        files: [
          {
            expand: true,
            src: '<%= path.docs %>*.md',
            dest: '<%= path.tmp %>',
            ext: '.md'
          }
        ]
      }
    },
    styleguide: {
      dist: {
        options: {
          framework: {
            name: 'kss',
            options: {
              mask: '*.scss'
            }
          },
          template: {
            src: '<%= path.docs %>template/'
          }
        },
        files: {
          '<%= path.dist %>styleguide/': '<%= path.blocks %>**/*.scss'
        }
      }
    },

    // Development
    watch: watchConfig,
    notify: {
      options: {
        title: 'grunt'
      },
      page: {
        options: {
          title: 'grunt',
          message: 'Page reloaded'
        }
      },
      styles: {
        options: {
          message: 'Styles reloaded'
        }
      },
      scripts: {
        options: {
          message: 'Scripts reloaded'
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*',
          middleware: function (connect) {
            var base = require('path').resolve('.');

            return [
              lrSnippet,
              connect['static'](base),
              connect.directory(base)
            ];
          }
        }
      }
    }
  });

  grunt.registerMultiTask('teamcity', 'TeamCity interaction', function() {
    grunt.util._.each(this.data, function(item) {
      var message = '##teamcity[' + item.message;

      grunt.util._.forIn(item.data, function(value, key) {
        message += ' ' + key + '=\'' + value + '\'';
      });

      message += ']';

      grunt.log.writeln(message);
    });
  });

  grunt.registerTask('jsdoc', 'Generate jsdoc documentation', function() {
    var done = this.async();

    grunt.util.spawn({
        cmd: 'node_modules/.bin/jsdoc',
        args: ['blocks/', '-r', '-d', path.dist + 'docs/']
      },
      function(err)
      {
        if (err) {
          grunt.log.write(err);
        }

        done();
      }
    );
  });

  grunt.registerMultiTask('htmlmin', 'Trim whitespace chars from Handlebars templates', function() {
    var _s = require('underscore.string');

    this.files.forEach(function(file) {
      var contents = file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
          // Read and return the file's source.
          return _s.clean(grunt.file.read(filepath));
        }).join('\n');
      grunt.file.write(file.dest, contents);
      grunt.log.ok('File "' + file.dest + '" created.');
    });
  });

  grunt.registerMultiTask('toc', 'Generate toc', function() {
    var toc = require('md-toc');

    this.files.forEach(function(file) {
      var contents = file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
          // Read and return the file's source.
          return toc(grunt.file.read(filepath));
        }).join('\n');
      grunt.file.write(file.dest, contents);
      grunt.log.ok('File "' + file.dest + '" created.');
    });
  });

  grunt.registerTask('install',   ['bower']);
  grunt.registerTask('uninstall', ['clean:modules', 'clean:hooks']);
  grunt.registerTask('cleanup',   ['clean:generated']);


  grunt.registerTask('font', [
    'webfont',
    'styles',
    'styleguide'
  ]);

  grunt.registerTask('styles', [
    'clean:styles',
    'copy:codemirror',
    //'svg-sprites',
    'sass',
    'autoprefixer',
    'copy:fonts'
  ]);

  grunt.registerTask('templates', [
    'htmlmin',
    'handlebars'
  ]);

  grunt.registerTask('default', [
    'cleanup',
    'jshint:dev',
    'process'
  ]);

  grunt.registerTask('docs', [
    'toc',
    'markdown',
    'styleguide'
  ]);

  grunt.registerTask('process', [
    'install',
    'styles',
    'templates',
    'requirejs',
    'docs',
    'jsdoc',
    'copy:blocks'
  ]);

  grunt.registerTask('server', function () {
    var tasks = [
      'githooks',
      'install',
      'styles',
      'templates',
      'connect',
      'watch'
    ];

    if (args.indexOf('test') !== -1) {
      tasks.unshift('karma:dev');
    }

    grunt.task.run(tasks);
  });

  grunt.registerTask('minify', [
    'csswring',
    'uglify'
  ]);

  grunt.registerTask('build', [
    'cleanup',
    'teamcity:jshint',
    'jshint:dist',
    'process',
    'karma:dist',
    'minify'
  ]);

  grunt.registerTask('test', [
    'karma:test'
  ]);

  grunt.registerTask('release', [
    'build',
    'compress'
  ]);
};