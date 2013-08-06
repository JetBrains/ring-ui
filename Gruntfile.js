/*jshint scripturl:true*/
var hljs = require('highlight.js');

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});

module.exports = function(grunt) {

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
      wrap: {
        startFile: path.bundles + 'ring-start.frag',
        endFile: path.bundles + 'ring-end.frag'
      }
    }
  };

  var _ = grunt.util._;
  var pkg = grunt.file.readJSON('package.json');

  // Set version option form build option
  (function(option) {
    var DELIM = '.';

    var ver = pkg.version.split(DELIM);
    var oldVer = ver.pop();
    ver.push(option('build') || ++oldVer);

    option('setversion', ver.join(DELIM));
  }(grunt.option));

  grunt.initConfig({
    pkg: pkg,
    version: grunt.option('setversion'),
    path: path,

    // Build
    csso: {
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
    uglify: {
      dist: {
        options: {
          report: 'gzip'
        },
        files: [{
          expand: true,
          cwd: '<%= path.dist %>',
          src: ['*.js'],
          ext: '.min.js',
          dest: '<%= path.dist %>'
        }]
      }
    },
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '/* <%= pkg.name %> <%= version %> */'
        },
        files: {
          src: [ '<%= path.dist %>**/*.js', '<%= path.dist %>**/*.css' ]
        }
      }
    },
    compress: {
      options: {
        pretty: true
      },
      dist: {
        options: {
          archive: './<%= path.dist %><%= pkg.name %>-<%= version %>.zip'
        },
        files: [
          { expand: true, cwd: '<%= path.dist %>', src: ['**'], dest: 'ring'}
        ]
      },
      coverage: {
        options: {
          archive: '<%= path.dist %>coverage.zip'
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
        reporters: ['teamcity', 'coverage']
      },
      dev: {
        background: true,
        browsers: ['Chrome', 'Firefox', 'IE7 - WinXP', 'IE10 - Win7']
      },
      test: {
        singleRun: true
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      dev: ['*.js', '<%= path.blocks %>**/*.js', '<%= path.bundles %>*.js'],
      dist: {
        options: {
          reporter: 'jslint',
          reporterOutput: '<%= path.jshintreport %>'
        },
        files: {
          src: ['*.js', '<%= path.blocks %>**/*.js', '<%= path.bundles %>*.js']
        }
      }
    },
    bump: {
      options: {
        createTag: false,
        pushTo: 'origin'
      }
    },

    // Process
    clean: {
      generated: ['<%= path.dist %>', '<%= path.tmp %>'],
      modules: ['node_modules', 'components']
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
          outputStyle: 'nested'
        },
        files: {
          '<%= path.dist %>ring.css': '<%= path.bundles %>ring.scss'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 3 versions', '> 1%', 'ie 8', 'ie 7']
      },
      files: {
        src : '<%= path.dist %>ring.css',
        dest: '<%= path.dist %>ring.css'
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: false,
          node: false
        },
        files: {
          '<%= path.tmp %>/templates.js': ['<%= path.blocks %>**/*.hbs']
        }
      }
    },
    preprocess: {
      handlebars: {
        src: '<%= path.shims %>handlebars/handlebars.js',
        dest: '<%= path.tmp %>/handlebars.js'
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
            jquery: '../components/jquery/jquery'
          },
          out: '<%= path.dist %>ring-jetbrains-confluence.js'
        })
      },
      'ring-jetbrains-oauth': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-jetbrains-oauth'
          },
          out: '<%= path.dist %>ring-jetbrains-oauth.js'
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
            '<%= path.blocks %>**/*.svg',
            '<%= path.blocks %>font-icon/*.png',
            '!<%= path.blocks %>**/*.dev.svg'
          ],
          dest: '<%= path.dist %>fonts'
        }]
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

    // Development
    watch: {
      options: {
        livereload: LIVERELOAD_PORT
      },
      scss: {
        files: ['<%= path.blocks %>**/*.scss', '<%= path.bundles %>**/*.scss'],
        tasks: ['styles', 'notify:watch']
      },
      reload: {
        files: ['<%= path.blocks %>**/*.html', '*.html'],
        tasks: ['notify:watch']
      },
      js: {
        files: ['<%= path.blocks %>**/*.js', '<%= path.bundles %>**/*.js', '<%= path.tests %>**/*.js'],
        tasks: ['jshint:dev', 'requirejs:ring', 'karma:dev:run', 'notify:watch']
      },
      markdown: {
        files: ['<%= path.docs %>**/*.md'],
        tasks: ['docs', 'notify:watch']
      },
      templates: {
        files: ['<%= path.blocks %>**/*.hbs'],
        tasks: ['templates', 'notify:watch']
      }
    },
    notify: {
      watch: {
        options: {
          title: 'grunt',
          message: 'Page reloaded'
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

  grunt.registerTask('sprite', 'Render font icons to png sprite', function() {
    var phantomjs = require('phantomjs');

    var done = this.async();

    grunt.util.spawn({
        cmd: phantomjs.path,
        args: ['blocks/font-icon/font-icon.phantomjs.coffee']
      },
      function(err)
      {
        if (!err) {
          grunt.log.ok('Sprite rendered');
        } else {
          grunt.log.error(err.stdout, err.stderr);
        }

        done();
      }
    );

  });

  grunt.registerMultiTask('toc', 'Generate toc', function() {
    var toc = require('md-toc-filter');

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
      grunt.log.writeln('File "' + file.dest + '" created.');
    });
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('install',   ['bower']);
  grunt.registerTask('uninstall', ['clean:modules']);
  grunt.registerTask('cleanup',   ['clean:generated']);

  grunt.registerTask('styles', [
    'sass',
    'autoprefixer',
    'copy:fonts'
  ]);

  grunt.registerTask('templates', [
    'handlebars',
    'preprocess'
  ]);

  grunt.registerTask('default', [
    'cleanup',
    'jshint:dev',
    'process'
  ]);

  grunt.registerTask('docs', [
    'toc',
    'markdown'
  ]);

  grunt.registerTask('process', [
    'install',
    'styles',
    'templates',
    'requirejs',
    'docs'
  ]);

  grunt.registerTask('server', [
    'karma:dev',
    'connect',
    'watch'
  ]);

  grunt.registerTask('minify', [
    'csso',
    'uglify',
    'usebanner'
  ]);

  grunt.registerTask('build', [
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
    'cleanup',
//    'bump',
    'build',
    'compress'
  ]);

  grunt.registerTask('build-as-dep', ['process']);
};