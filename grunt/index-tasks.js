module.exports = function (grunt)
{
    'use strict';
    grunt.registerTask('index', ['replace:index', 'uglify:index', 'htmlmin:index', 'imagemin:index', 'copy:index']);

    return {
        replace: {
            options: {
                patterns: [
                    {
                        match: /<!-- js -->[\s\S]*<!-- \/js -->/,
                        replacement: '<!-- js -->\n\t' +
                        '<script src="/index.min.js"></script>' +
                        '\n<!-- /js -->',
                        expression: true
                    },
                    {// inject template module
                        match: /\/\/\W*@@templates/,
                        replacement: ',\'templates\'',
                        expression: true
                    }
                ]
            },
            files: [
                {
                    expand: true,      // Enable dynamic expansion.
                    cwd: 'build',       // Src matches are relative to this path.
                    src: ['**/*.html'],      // Actual pattern(s) to match.
                    dest: 'build'      // Destination path prefix.
                }
            ]
        },

        uglify: {
            files: {
                'dist/index.min.js': [
                    'build/lib/jquery-1.11.0.min.js',
                    'build/lib/bootstrap.min.js',
                    'build/index.js'
                ]
            }
        },

        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            files: [
                {
                    expand: true,           // Enable dynamic expansion.
                    cwd: 'build',        // Src matches are relative to this path.
                    src: ['**/*.html'],      // Actual pattern(s) to match.
                    dest: 'dist'      // Destination path prefix.
                }
            ]
        },

        imagemin: {
            options: {                       // Target options
                optimizationLevel: 7
            },
            files: [{
                expand: true,
                cwd: 'build/',
                src: [
                    'img/**/*.*',
                    'favicon.ico',
                    '*.png'
                ],
                dest: 'dist/'
            }]
        },

        copy: {
            files: [
                {
                    expand: true,           // Enable dynamic expansion.
                    cwd: 'build',     // Src matches are relative to this path.
                    src: [
                        'fonts/**/*',
                        '*.php',
                        '*.xml',
                        '*.txt',
                        'docs/**/*'
                    ],
                    dest: 'dist'      // Destination path prefix.
                }
            ]
        }
    };
};
