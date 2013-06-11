module.exports = function(grunt) {

    // TODO Grunt plugin for compilation
    grunt.initConfig({
        shell: {
            clean: {
                command: 'rm *.css',
                options: {
                    stdout: false,
                    stderr: false
                }
            },
            ring: {
                command: 'java -jar tools/jruby/jruby-complete-1.7.4.jar -S compile.rb compile ring.scss',
                options: {
                    failOnError: true,
                    stdout: true,
                    stderr: true
                }
            },
            blocks: {
                command: 'java -jar tools/jruby/jruby-complete-1.7.4.jar -S compile.rb compile blocks.scss',
                options: {
                    failOnError: true,
                    stdout: true,
                    stderr: true
                }
            }
        },
        dot: {
            dist: {
                options: {
                    variable : 'templates',
                    root     :  '.'
                },
                src  : ['blocks/**/*.html'],
                dest : 'ring.templates.js'
            }
        },
        preprocess: {
            js : {
                src : 'ring.js',
                dest : 'ring.processed.js'
            }
        },
        watch: {
            ring: {
                files: ['blocks/**/*.scss', '*.scss'],
                tasks: ['shell:ring',  'notify:watch'],
                options: {
                    livereload: true
                }
            },
            preprocess: {
                files: ['blocks/**/*.js', '*.js'],
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
                files: ['blocks/**/*.html'],
                tasks: ['templates'],
                options: {
                    livereload: true
                }
            }
        },
        notify: {
            watch: {
                options: {
                    title: 'OK',
                    message: 'Page reloaded'
                }
            }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['shell', 'dot', 'preprocess']);
    grunt.registerTask('templates', ['dot', 'preprocess']);
};