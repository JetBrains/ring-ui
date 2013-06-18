module.exports = function(grunt) {

    grunt.initConfig({
        // Install & build
        shell: {
            clean: {
                command: [
                    'rm -rf ./dist',
                    'rm -rf ./tmp'
                ].join(';'),
                options: {
                    stdout: false,
                    stderr: false
                }
            },
            install: {
                command: 'node_modules/bower/bin/bower install',
                options: {
                    failOnError: true,
                    stdout: true,
                    stderr: true
                }
            },
            uninstall: {
                command: [
                    'rm -rf ./node_modules',
                    'rm -rf ./components'
                ].join(';'),
                options: {
                    stdout: false,
                    stderr: false
                }
            },
            build: {
                command: [
                    'mkdir -p dist/ring',
                    'mkdir -p dist/ring-lib',
                    'java -jar tools/jruby/jruby-complete-1.7.4.jar -S compile.rb compile bundles/ring-lib/ring-lib.scss',
                    'java -jar tools/jruby/jruby-complete-1.7.4.jar -S compile.rb compile bundles/ring/ring.scss',
                    'mv bundles/ring/ring.css dist/ring',
                    'mv bundles/ring-lib/ring-lib.css dist/ring-lib'
                ].join(';'),
                options: {
                    failOnError: true,
                    stdout: true,
                    stderr: true
                }
            }
        },
        copy: {
            fonts: {
                files: [
                    {expand: true, src: ['blocks/**/*.woff', 'blocks/**/*.eot', 'blocks/**/*.ttf', 'blocks/**/*.svg'], dest: 'dist/ring'},
                    {expand: true, src: ['blocks/**/*.woff', 'blocks/**/*.eot', 'blocks/**/*.ttf', 'blocks/**/*.svg'], dest: 'dist/ring-lib'}
                ]
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

        // Development
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

    grunt.registerTask('install',   ['shell:install']);
    grunt.registerTask('uninstall', ['shell:uninstall']);
    grunt.registerTask('clean',     ['shell:clean']);

    grunt.registerTask('default',   ['compass', 'handlebars', 'preprocess', 'copy:fonts']);
    grunt.registerTask('build',     ['shell:build', 'copy:fonts', 'handlebars', 'preprocess']);
    grunt.registerTask('templates', ['handlebars', 'preprocess']);
};