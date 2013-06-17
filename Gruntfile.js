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
                command: 'compass compile ring.scss',
                options: {
                    failOnError: true,
                    stdout: true,
                    stderr: true
                }
            },
            blocks: {
                command: 'compass compile blocks.scss',
                options: {
                    failOnError: true,
                    stdout: true,
                    stderr: true
                }
            },
            bower: {
                command: 'node_modules/bower/bin/bower install',
                options: {
                    failOnError: true,
                    stdout: true,
                    stderr: true
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
                    "ring.hbs.js": ["blocks/**/*.hbs"]
                }
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
                files: ['blocks/**/*.js', '*.json', 'ring.js'],
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

    grunt.registerTask('default', ['shell', 'dot', 'preprocess']);
    grunt.registerTask('templates', ['dot', 'handlebars', 'preprocess']);
    grunt.registerTask('install', ['shell:bower']);
};