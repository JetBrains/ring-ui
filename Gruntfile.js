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
        watch: {
            ring: {
                files: ['blocks/**/*.scss', '*.scss'],
                tasks: ['shell:ring',  'notify:watch'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['*.js', '*.html'],
                tasks: ['notify:watch'],
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

    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['shell']);
};