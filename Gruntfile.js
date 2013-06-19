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
          archive: './dist/ring.zip'
        },
        files: [
          {expand: true, cwd: './dist/ring/', src: ['**'], dest: 'ring'}
        ]
      },
      'ring-lib': {
        options: {
          archive: './dist/ring-lib.zip'
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
          "tmp/ring.hbs.js": ["blocks/**/*.hbs"]
        }
      }
    },
    preprocess: {
      js: {
        src : 'bundles/ring/ring.js',
        dest : 'dist/ring/ring.js'
      }
    },
    copy: {
      fonts: {
        options: {
          processContentExclude: '*.dev.svg'
        },
        files: [
          {expand: true, src: ['blocks/**/*.woff', 'blocks/**/*.eot', 'blocks/**/*.ttf', 'blocks/**/*.svg', '!blocks/**/*.dev.svg'], dest: 'dist/ring'},
          {expand: true, src: ['blocks/**/*.woff', 'blocks/**/*.eot', 'blocks/**/*.ttf', 'blocks/**/*.svg', '!blocks/**/*.dev.svg'], dest: 'dist/ring-lib'}
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
      generated: ["dist", "tmp"],
      modules: ["node_modules", "components"]
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
        files: ['blocks/**/*.js', 'blocks/**/*.json', 'bundles/**/*.js'],
        tasks: ['preprocess:js',  'notify:watch'],
        options: {
          livereload: true
        }
      },
      reload: {
        files: ['*.html'],
        tasks: ['notify:watch'],
        options: {
          livereload: true
        }
      },
      templates: {
        files: ['blocks/**/*.hbs'],
        tasks: ['templates',  'notify:watch'],
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
          hostname: '*',
          keepalive: true

        }
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('install',   ['bower']);
  grunt.registerTask('uninstall', ['clean:modules']);
  grunt.registerTask('cleanup',   ['clean:generated']);

  grunt.registerTask('default',   ['compass', 'handlebars', 'preprocess', 'copy:fonts']);
  grunt.registerTask('build',     ['shell:dist', 'copy:fonts', 'handlebars', 'preprocess', 'csso', 'uglify', 'compress']);
  grunt.registerTask('templates', ['handlebars', 'preprocess']);
};