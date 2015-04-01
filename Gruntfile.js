module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'images/build/'
                }]
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    debugInfo: true,
                    sourcemap: true
                },
                files: {
                    'css/app.css': 'sass/app.scss'
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['js/*.js'],
                options: {
                    spawn: false
                }
            },
            images: {
                files: ['images/**/*.{png,jpg,gif}', 'images/*.{png,jpg,gif}'],
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
            css: {
                files: '**/*.scss',
                tasks: ['sass'],
                sourceComments: 'normal'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('default', ['watch', 'sass']);

};
