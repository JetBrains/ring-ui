/*jshint scripturl:true */
var hljs = require('highlight.js');

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

  grunt.initConfig({
    // Configuration
    pkg: grunt.file.readJSON('package.json'),
    buildVersion: (function(option) {
      var build = option('build');
      var rev   = option('rev');

      if (rev && build) {
        return '.' + rev.substr(0,7) + '.' + build;
      } else {
        return '_' + grunt.template.today('yyyy-mm-dd_HH-MM-ss');
      }

    }(grunt.option)),
    path: path,

    // Build
    csso: {
      dist: {
        files: {
          '<%= path.dist %>ring.min.css': ['<%= path.dist %>ring.css']
        }
      }
    },
    uglify: {
      dist: {
        options: {
          report: 'gzip'
        },
        files: {
          '<%= path.dist %>ring.min.js': '<%= path.dist %>ring.js'
        }
      }
    },
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '/* <%= pkg.name %> <%= pkg.version %><%= buildVersion %> */'
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
          archive: '<%= path.dist %><%= pkg.name %>-<%= pkg.version %><%= buildVersion %>.zip'
        },
        files: [
          { expand: true, cwd: '<%= path.dist %>', src: ['**'], dest: 'ring'}
        ]
      },
      coverage: {
        options: {
          archive: '<%= path.dist %>coverage.zip'
        },
        files: [
          { expand: true, cwd: '<%= path.tmp %>/coverage/', src: ['*/**'], dest: ''}
        ]
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
        browsers: ['Chrome', 'Firefox']
      },
      test: {
        singleRun: true,
        reporters: 'spec'
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
      'ring-internal': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-internal'
          },
          out: '<%= path.dist %>ring-internal.js'
        })
      },
      'ring-internal-oauth': {
        options: _.extend(_.clone(requireConfig.options), {
          paths: {
            ring: '../<%= path.bundles %>ring-internal-oauth'
          },
          out: '<%= path.dist %>ring-internal-oauth.js'
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
            src: '<%= path.docs %>*.md',
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

    // Development
    watch: {
      scss: {
        files: ['<%= path.blocks %>**/*.scss', '<%= path.bundles %>**/*.scss'],
        tasks: ['styles',  'notify:watch'],
        options: {
          livereload: true
        }
      },
      reload: {
        files: ['<%= path.test %>*.html', '*.html'],
        tasks: ['notify:watch'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['<%= path.blocks %>**/*.js', '<%= path.bundles %>**/*.js', '<%= path.tests %>**/*.js'],
        tasks: ['requirejs:ring', 'karma:dev:run', 'notify:watch'],
        options: {
          livereload: true
        }
      },
      test: {
        files: ['<%= path.blocks %>**/*.html'],
        tasks: ['test', 'notify:watch'],
        options: {
          livereload: true
        }
      },
      markdown: {
        files: ['<%= path.docs %>**/*.md'],
        tasks: ['markdown', 'notify:watch'],
        options: {
          livereload: true
        }
      },
      templates: {
        files: ['<%= path.blocks %>**/*.hbs'],
        tasks: ['templates', 'notify:watch'],
        options: {
          livereload: true
        }
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
          hostname: '*'
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

  grunt.registerTask('process', [
    'install',
    'styles',
    'templates',
    'requirejs',
    'markdown'
  ]);

  grunt.registerTask('server', [
    'karma:dev',
    'connect',
    'watch'
  ]);

  grunt.registerTask('minify', [
    'csso',
    'uglify',
    'usebanner',
    'compress'
  ]);

  grunt.registerTask('build', [
    'teamcity:jshint',
    'jshint:dist',
    'process',
    'karma:dist',
    'minify'
  ]);

  grunt.registerTask('build-as-dep', [
    'install',
    'styles',
    'templates',
    'requirejs'
  ]);

  grunt.registerTask('test', [
    'karma:test'
  ]);
};