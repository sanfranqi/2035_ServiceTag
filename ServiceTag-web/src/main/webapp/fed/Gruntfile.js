'use strict';

var exec = require('child_process').exec;
var child;

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
    var template = transport.template.init(grunt);
    // configurable paths
    var yeomanConfig = {
        app: 'js/app',
        css: 'css',
        sea: 'sea-modules',
        dist: 'dist'
    };
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: grunt.file.readJSON('fed.json'),
        yeoman: yeomanConfig,
        jshint: {
            options: {
                // read jshint options from jshintrc file
                "jshintrc": ".jshintrc"
            },
            app: ['<%= yeoman.app %>/**/*.js']
        },

        open: {
            server: {
                url: 'http://localhost:<%= cfg.server.port %>'
            }
        },

        transport: {
            options: {
                paths: ['<%= yeoman.sea %>'],
                parsers: {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.html' : [text.html2jsParser],
                    '.handlebars': [template.handlebarsParser]
                },
                alias: '<%= pkg.spm.alias %>'
            },

            app: {
                options: {
                    idleading: 'app/'
                },

                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/',
                        src: ['**/*', '!**/package.json'],
                        filter: 'isFile',
                        dest: '.build/app'
                    }
                ]
            }
        },

        concat: {
            options: {
                paths: ['<%= yeoman.sea %>'],
                include: 'all'
            },
            app: {
                options: {
                    // 不能用 style.css2js ,不然打包失败
                    // https://github.com/spmjs/grunt-cmd-concat/issues/32
                    css2js: transport.style.css2js
                },
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['app/**/*.js'],
                        dest: '<%= yeoman.dist %>/js',
                        ext: '.js'
                    }
                ]
            }
        },

        watch: {
            app: {
                files: ["<%= yeoman.app %>/{,*/}*.js"],
                tasks: ["jshint"],
                options: {
                    nospawn: true,
                    interrupt: false,
                    debounceDelay: 100
                }
            }
        },

        uglify: {
            app: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/',
                        src: ['js/app/**/*.js', '!js/app/**/*-debug.js', '!js/jquery/**'],
                        dest: '<%= yeoman.dist %>/',
                        ext: '.js'
                    }
                ]
            },
            common: {
                files: [
                    {
                        expand: true,
                        cwd: 'js/',
                        src: ['*.js'],
                        dest: '<%= yeoman.dist %>/js',
                        ext: '.js'
                    }
                ]
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, flatten: false, src: ['js/jquery/**'], dest: '<%= yeoman.dist %>/'},
                    {expand: true, flatten: false, src: ['js/seajs/**'], dest: '<%= yeoman.dist %>/'},
                    {expand: true, flatten: false, src: ['js/ueditor/**'], dest: '<%= yeoman.dist %>/'}
                ]
            },
            cdnjs: {
                files: [
                    {
                        expand: true,
                        flatten: false,
                        src: ['dist/js/**/*.js', '!dist/js/ueditor/**'],
                        dest: '<%= yeoman.dist %>/cdnjs/',
                        rename: function (dest, src) {
                            return dest + src.replace('dist/js/', '');
                        }
                    }
                ]
            }
        },

        clean: {
            build: ['.build'],
            cdnjs: ['<%= yeoman.dist %>/cdnjs/app/common', '<%= yeoman.dist %>/cdnjs/app/**/*.js', '!**/main.js']
        },

        fed: {
            server: {
                config: 'fed.json'
            }
        }
    });

    grunt.registerTask('default', ['fed']);
    grunt.registerTask('server', ['fed']);
    grunt.registerTask('build', ['jshint', 'transport', 'concat', 'uglify', 'copy', 'clean']);

};
