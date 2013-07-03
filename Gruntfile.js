module.exports = function(grunt) {

  grunt.initConfig({
    // Build
    csso: {
      dist: {
        files: {
          'dist/ring.min.css': ['dist/ring.css']
        }
      }
    },
    uglify: {
      dist: {
        options: {
          report: 'gzip'
        },
        files: {
          'dist/ring.min.js': 'dist/ring.js'
        }
      }
    },
    compress: {
      ring: {
        options: {
          archive: './dist/ring-ui.zip'
        },
        files: [
          {expand: true, cwd: './dist/', src: ['**'], dest: 'ring'}
        ]
      }
    },

    // Process files
    sass: {
      dist: {
        options: {
          includePaths: ['blocks/**/'],
          outputStyle: 'nested'
        },
        files: {
          'dist/ring.css': 'bundles/ring.scss'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 3 versions', '> 1%', 'ie 8', 'ie 7']
      },
      files: {
        src : 'dist/ring.css',
        dest: 'dist/ring.css'
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: false,
          node: false
        },
        files: {
          'shims/handlebars/templates.js': ['blocks/**/*.hbs']
        }
      }
    },
    preprocess: {
      handlebars: {
        src: 'shims/handlebars/handlebars.tmpl.js',
        dest: 'shims/handlebars/handlebars.js'
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'blocks',
          name: '../components/almond/almond',
          mainConfigFile: 'bundles/ring.config.js',
          include: 'ring',
          out: 'dist/ring.js',
          optimize: 'none',
          wrap: {
            startFile: 'bundles/ring-start.frag',
            endFile: 'bundles/ring-end.frag'
          }
        }
      }
    },
    copy: {
      fonts: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            'blocks/**/*.woff',
            'blocks/**/*.eot',
            'blocks/**/*.ttf',
            'blocks/**/*.svg',
            'blocks/**/*.png',
            '!blocks/**/*.dev.svg'
          ],
          dest: 'dist/fonts'
        }]
      }
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
      generated: ['dist', 'shims/handlebars/handlebars.js', 'shims/handlebars/templates.js'],
      modules: ['node_modules', 'components']
    },
    watch: {
      scss: {
        files: ['blocks/**/*.scss', 'bundles/**/*.scss'],
        tasks: ['styles',  'notify:watch'],
        options: {
          livereload: true
        }
      },
      reload: {
        files: ['*.html', 'blocks/*/*.js', 'bundles/**/*.js'],
        tasks: ['notify:watch'],
        options: {
          livereload: true
        }
      },
      templates: {
        files: ['blocks/**/*.hbs'],
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
      all: ['Gruntfile.js', 'blocks/**/*.js']
    }
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
    'install',
    'styles',
    'templates'
  ]);

  grunt.registerTask('server', [
    'default',
    'connect',
    'watch'
  ]);

  grunt.registerTask('minify', [
    'csso',
    'uglify',
    'compress'
  ]);

  grunt.registerTask('build', [
    'default',
    'requirejs',
    'minify'
  ]);

};