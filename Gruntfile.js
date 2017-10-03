/*
 * grunt-honeybadger-sourcemaps
 * https://github.com/bigbinary/grunt-honeybadger-sourcemaps
 *
 * Copyright (c) 2017 arbaaz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Configuration to be run (and then tested).
    honeybadger_sourcemaps: {
      default_options: {
        options: {
          token: 'xxxx',
          appId: 'xxxxx',
          urlPrefix: 'http://example.com/',
        },
        files: [{
          src: ['test/maps/**/*.map']
        }]
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['honeybadger_sourcemaps']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
