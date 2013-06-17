module.exports = function(grunt) {

    // TODO Grunt plugin for compilation
    grunt.initConfig({
        shell: {
            clean: {
                command: [
                    'rm -rf ./dist',
                    'rm -rf ./tmp',
                    'rm -rf ./node_modules',
                    'rm -rf ./components'
                ].join(';'),
                options: {
                    stdout: false,
                    stderr: false
                }
            },
            compass: {
                command: 'compass compile --sass-dir bundles --css-dir dist',
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
                    "tmp/ring.hbs.js": ["blocks/**/*.hbs"]
                }
            }
        },
        preprocess: {
            js : {
                src : 'bundles/ring/ring.js',
                dest : 'dist/ring/ring.js'
            }
        },
        watch: {
            ring: {
                files: ['blocks/**/*.scss', 'bundles/**/*.scss'],
                tasks: ['shell:compass',  'notify:watch'],
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

    grunt.registerTask('install',   ['shell:bower']);
    grunt.registerTask('clean',     ['shell:clean']);

    grunt.registerTask('default',   ['shell:compass', 'handlebars', 'preprocess']);
    grunt.registerTask('templates', ['handlebars', 'preprocess']);
};