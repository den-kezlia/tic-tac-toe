module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'app/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'app/images/build/'
                }]
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    debugInfo: true,
                    sourcemap: true
                },
                files: {
                    'app/public/css/app.css': 'app/sass/app.scss'
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['app/**/*.js'],
                options: {
                    spawn: false
                }
            },
            images: {
                files: ['app/images/**/*.{png,jpg,gif}', 'app/images/*.{png,jpg,gif}'],
                tasks: ['imagemin'],
                options: {
                    spawn: false
                }
            },
            html:{
                files: ['./**/*.html'],
                tasks: [],
                options: {
                    spawn: false
                }
            },
            jade:{
                files: ['./**/*.jade'],
                tasks: [],
                options: {
                    spawn: false
                }
            },
            css: {
                files: '**/*.scss',
                tasks: ['sass'],
                sourceComments: 'normal'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch', 'sass']);

};
