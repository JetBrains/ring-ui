module.exports = function(grunt) {

  grunt.initConfig({
    // Build
    shell: {
      dist: {
        command: 'java -jar tools/jruby/jruby-complete-1.7.4.jar -S compile.rb compile --sass-dir bundles --css-dir dist --images-dir . -I blocks',
        options: {
          failOnError: true,
          stdout: true,
          stderr: true
        }
      },
      hooks: {
        command: [
          'echo "grunt jshint" > .git/hooks/pre-commit',
          'chmod +x .git/hooks/pre-commit'
        ].join(' && ')
      }
    },
    csso: {
      dist: {
        files: {
          'dist/ring/ring.min.css':         ['dist/ring/ring.css'],
          'dist/ring-lib/ring-lib.min.css': ['dist/ring-lib/ring-lib.css']
        }
      }
    },
    uglify: {
      dist: {
        options: {
          report: 'gzip'
        },
        files: {
          'dist/ring/ring.min.js': 'dist/ring/ring.js'
        }
      }
    },
    compress: {
      ring: {
        options: {
          archive: './dist/ring-ui-common-headers.zip'
        },
        files: [
          {expand: true, cwd: './dist/ring/', src: ['**'], dest: 'ring'}
        ]
      },
      'ring-lib': {
        options: {
          archive: './dist/ring-ui-blocks-library.zip'
        },
        files: [
          {expand: true, cwd: './dist/ring-lib/', src: ['**'], dest: 'ring-lib'}
        ]
      }
    },

    // Process files
    compass: {
      dist: {
        options: {
          sassDir: 'bundles',
          cssDir: 'dist',
          imagesDir: '.',
          importPath: 'blocks'
        }
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
          mainConfigFile: 'bundles/ring/ring.config.js',
          include: 'ring',
          out: 'dist/ring/ring.js',
          optimize: 'none',
          wrap: {
            startFile: 'bundles/ring/ring-start.frag',
            endFile: 'bundles/ring/ring-end.frag'
          }
        }
      }
    },
    copy: {
      fonts: {
        files: [
          {expand: true, flatten: true, src: ['blocks/**/*.woff', 'blocks/**/*.eot', 'blocks/**/*.ttf', 'blocks/**/*.svg', '!blocks/**/*.dev.svg'], dest: 'dist/ring/fonts'},
          {expand: true, flatten: true, src: ['blocks/**/*.woff', 'blocks/**/*.eot', 'blocks/**/*.ttf', 'blocks/**/*.svg', '!blocks/**/*.dev.svg'], dest: 'dist/ring-lib/fonts'}
        ]
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
        tasks: ['compass',  'notify:watch'],
        options: {
          livereload: true
        }
      },
      preprocess: {
        files: ['**/*.frag', '**/*.frag.js'],
        tasks: ['preprocess', 'requirejs',  'notify:watch'],
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

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('install',   ['bower']);
  grunt.registerTask('uninstall', ['clean:modules']);
  grunt.registerTask('cleanup',   ['clean:generated']);

  grunt.registerTask('server',    ['connect','watch']);
  grunt.registerTask('hooks',     ['shell:hooks']);

  grunt.registerTask('templates', ['handlebars', 'preprocess']);

  grunt.registerTask('default',   [
    'install',
    'compass',
    'copy:fonts',
    'templates',
    'requirejs'
  ]);

  grunt.registerTask('build', [
    // Deps
    'install',
    // Styles
    'shell:dist',
    'copy:fonts',
    'csso',
    // JS
    'templates',
    'requirejs',
    'uglify',
    // Artifact
    'compress'
  ]);

};