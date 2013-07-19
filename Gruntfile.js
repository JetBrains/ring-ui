var hljs = require('highlight.js');

module.exports = function(grunt) {

  var path = {
    dist: 'dist/',
    blocks: 'blocks/',
    bundles: 'bundles/',
    docs: 'docs/',
    tmp:  'tmp/',
    jshintreport: 'tmp/jshintreport.xml',
    shims: 'shims/'
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
  var version = function() {
    var DELIM = '.';

    var ver = pkg.version.split(DELIM);
    var oldVer = ver.pop();
    ver.push(grunt.option('build') || ++oldVer);

    return ver.join(DELIM);
  };

  grunt.initConfig({
    pkg: pkg,
    version: version(),
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
          '<%= path.dist %>ring.min.js': '<%= path.dist %>ring.js',
          '<%= path.dist %>ring-jetbrains-oauth.min.js': '<%= path.dist %>ring-jetbrains-oauth.js',
          '<%= path.dist %>ring-jetbrains.min.js': '<%= path.dist %>ring-jetbrains.js'
        }
      }
    },
    bumpup: {
      options: {
        version: version
      },
      file: 'package.json'
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
      dist: {
        options: {
          archive: './<%= path.dist %><%= pkg.name %>-<%= version %>.zip'
        },
        files: [
          { expand: true, cwd: '<%= path.dist %>', src: ['**'], dest: 'ring'}
        ]
      }
    },
    tagrelease: {
      file: 'package.json',
      commit:  true,
      message: 'Release %version%',
      prefix:  'v',
      annotate: false
    },

    // Process files
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
            ring: '../<%= path.bundles %>ring-jetbrains'
          },
          out: '<%= path.dist %>ring-jetbrains.js'
        })
      },
      'ring-internal-oauth': {
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

    // Development
    bower: {
      install: {
        options: {
          copy: false,
          verbose: true
        }
      }
    },
    clean: {
      generated: ['<%= path.dist %>', '<%= path.tmp %>'],
      modules: ['node_modules', 'components']
    },
    watch: {
      scss: {
        files: ['<%= path.blocks %>**/*.scss', '<%= path.bundles %>**/*.scss'],
        tasks: ['styles',  'notify:watch'],
        options: {
          livereload: true
        }
      },
      reload: {
        files: ['*.html', '<%= path.blocks %>*/*.js', '<%= path.bundles %>**/*.js'],
        tasks: ['notify:watch'],
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

  grunt.registerTask('push-tags', 'Push git tags', function() {
    var done = this.async();

    grunt.util.spawn({
        cmd: 'git push',
        args: ['--tags']
      },
      function(err)
      {
        if (!err) {
          grunt.log.ok('Tags pushed');
        } else {
          grunt.log.error(err.stdout, err.stderr);
        }

        done();
      }
    );

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
    'connect',
    'watch'
  ]);

  grunt.registerTask('minify', [
    'csso',
    'uglify',
    'usebanner'
  ]);

  grunt.registerTask('build', [
    'teamcity',
    'jshint:dist',
    'process',
    'minify'
  ]);

  grunt.registerTask('release', [
    'cleanup',
    'bumpup',
    'build',
    'compress'
//    'tagrelease'
//    'push-tags'
  ]);

  grunt.registerTask('build-as-dep', ['process']);
};