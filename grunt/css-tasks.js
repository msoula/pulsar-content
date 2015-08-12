module.exports = function (grunt)
{
    'use strict';
    grunt.registerTask('css', ['less:css', 'autoprefixer:css', 'copy:css']);

    return {
        less: {
            options: {
                banner: '/* GENERATED */\n',
                sourceMap: true,
                ieCompat: true
            },
            files: [
                {
                    expand: true,           // Enable dynamic expansion.
                    cwd: 'public/less',     	    // Src matches are relative to this path.
                    src: ['*.less'],     // Actual pattern(s) to match.
                    dest: 'build/css',      // Destination path prefix.
                    ext: '.css'             // Dest filepaths will have this extension.
                }
            ]
        },

        autoprefixer: {
            files: [
                {
                    expand: true,           // Enable dynamic expansion.
                    cwd: 'build/css',       // Src matches are relative to this path.
                    src: ['**/*.css'],      // Actual pattern(s) to match.
                    dest: 'build/css',      	    // Destination path prefix.
                    ext: '.css'             // Dest filepaths will have this extension.
                }
            ]
        },
        copy: {
            files: [
                {
                    expand: true,           // Enable dynamic expansion.
                    cwd: 'build/css',     // Src matches are relative to this path.
                    src: ['*.css'],     // Actual pattern(s) to match.
                    dest: 'public/css'      // Destination path prefix.
                }
            ]
        },
        uncss: {
            files: {
                'build/index.css': [
                    'build/**/*.html']
            },
            options: {
                stylesheets: ['css/bootstrap.css', 'css/index.css'],
                ignore: ['.item', '.carousel-inner']
            }
        },
        cssmin: {
            files: [
                {
                    expand: true,           // Enable dynamic expansion.
                    cwd: 'build',       	    // Src matches are relative to this path.
                    src: ['*.css'],      // Actual pattern(s) to match.
                    dest: 'dist',       // Destination path prefix.
                    ext: '.min.css'         // Dest filepaths will have this extension.
                }
            ],
            options: {
                keepSpecialComments: 0
            }
        },

        replace: {
            options: {
                patterns: [
                    {
                        match: /<!--.*css.*-->[\s\S]*<!--.*\/css.*-->/,
                        replacement: '<!-- css -->\n\t' +
                        '<link rel="stylesheet" href="/index.min.css">' +
                        '\n\t<!-- /css -->',
                        expression: true
                    }
                ]
            },
            files: [{
                expand: true,           // Enable dynamic expansion.
                cwd: 'build',       // Src matches are relative to this path.
                src: ['**/*.html'],      // Actual pattern(s) to match.
                dest: 'build'      // Destination path prefix.
            }]
        },

        watch: {
            files: ['public/less/*.less'],
            tasks: ['css']
        }
    };
};
