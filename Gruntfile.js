module.exports = function (grunt) {
    'use strict';
    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        data: {
            banner: '* <%= package.name %> - v<%= package.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * http://<%= package.homepage %>/\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                '<%= package.name %>'
        }
    });
};
