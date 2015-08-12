module.exports = function (grunt) {
    'use strict';
    grunt.registerTask('pre-build', ['clean:build', 'copy:build']);

    return {
        clean: ['build', 'dist'],
        copy: {
            files: [
                {
                    expand: true,           // Enable dynamic expansion.
                    cwd: 'app',     // Src matches are relative to this path.
                    src: ['**/*'],     // Actual pattern(s) to match.
                    dest: 'build'      // Destination path prefix.
                }
            ]
        }
    };
};
