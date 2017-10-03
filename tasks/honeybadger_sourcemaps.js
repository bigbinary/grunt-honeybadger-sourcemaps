/*
 * grunt-honeybadger-sourcemaps
 * https://github.com/bigbinary/grunt-honeybadger-sourcemaps
 *
 * Copyright (c) 2017 arbaaz
 * Licensed under the MIT license.
 */

'use strict';
var async = require('async');

module.exports = function(grunt) {

  var fs = require('fs');
  var rest = require('restler');
  var chalk = require('chalk');

  grunt.registerMultiTask('honeybadger_sourcemaps', 'Plugin for uploading sourcemaps to honeybadger', function () {
    var done = this.async();

    var options = this.options({
      appId: "",
      token: "",
      urlPrefix: "",
      prepareUrlParam: function(abspath) {
        return abspath;
      }
    });

    if (options.token === "") {
      grunt.fail.warn('Honeybadger-Token is missing.');
      return;
    }

    if (options.appId === "") {
      grunt.fail.warn('Honeybadger App ID is missing.');
      return;
    }

    if (options.urlPrefix === "") {
      grunt.fail.warn('Url Prefix is missing');
      return;
    }

    options.hbUrl = 'https://api.honeybadger.io/v1/source_maps';
    
    async.eachSeries(this.files, function (f, nextFileObj) { 
      grunt.verbose.writeln(chalk.green('source files:'), JSON.stringify(f));

      var files = f.src.filter(function (filepath) {

        if (!grunt.file.isFile(filepath)) {
          return false;
        }

        if (filepath.slice(-4) !== ".map") {
          grunt.log.warn('Source file "' + chalk.red(filepath) + '" doesn`t seem to be a sourcemap, will not be uploaded.');
          return false;
        }

        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + chalk.red(filepath) + '" not found.');
          return false;
        }

        return true;
      });

      if (files.length === 0) {

        if (f.src.length < 1) {
          grunt.log.warn('Destination ' + f.src + ' not written because no source files were found.');
        }

        return nextFileObj();
      }

      async.concatSeries(files, function (file, next) {
        grunt.verbose.writeln(chalk.green('source files:'), file);

        uploadToHoneyBadger(options, file, function (hasErr, err) {
          if (!hasErr) {
            grunt.log.ok('Upload successful of "' + file + '"');
            process.nextTick(next);
          } else {
            grunt.log.warn('Upload failed of "' + file + '"');
            nextFileObj(err);
          }
        });

      }, function () {
        nextFileObj();
      });

    }, done);
  });

  var uploadToHoneyBadger = function (options, sourceMapFilePath, callback) {
    var url = options.hbUrl;
    var minifiedFilePath = sourceMapFilePath.replace(".map", "");
    var minifiedFileUrl = options.urlPrefix + options.prepareUrlParam(minifiedFilePath);
    var apiKey = options.appId;
    var token = options.token;
    var revision = options.revision;

    fs.stat(sourceMapFilePath, function (err, sourceMapFileStat) {
      if (err) {
        callback(true, err);
        return;
      }

      if (!sourceMapFileStat.isFile()) {
        callback(true, 'file not found');
        return;
      }

      fs.stat(minifiedFilePath, function (error, minifiedFileState) {
        if (error) {
          callback(true, error);
          return;
        }
  
        if (!minifiedFileState.isFile()) {
          callback(true, 'file not found');
          return;
        }
        
        var sourceMapFileSize = sourceMapFileStat.size;
        var minifiedFileSize = minifiedFileState.size;
        var reqData = {
          api_key: apiKey,
          minified_url: minifiedFileUrl,
          minified_file: rest.file(minifiedFilePath, null, minifiedFileSize, null, null),
          source_map: rest.file(sourceMapFilePath, null, sourceMapFileSize, null, null),
          revision: revision,
        };
  
        const requestOptions = {
          headers: {
            'Honeybadger-Token': token
          },
          multipart: true,
          data: reqData,
        };
        grunt.verbose.writeln(chalk.green('requestOptions:'), requestOptions);
        postToHoneyBadger(url, requestOptions, callback)
      });
    });
  };

  var postToHoneyBadger = function(url, requestOptions, callback) {
    rest.post(url, requestOptions)
      .on('error', function (e) {
        grunt.fail.warn('Failed uploading (error code: ' + e.message + ')');
        callback(true, e.message);
      })
      .on('complete', function (jdata, response) {
        if (response !== null && response.statusCode === 201) {
          grunt.log.writeln(response.statusCode);
          callback(false);
        } else {
          grunt.fail.warn('Failed uploading (error message: ' + jdata.error + ')');
          callback(true, 'Failed uploading "' + file + '" (status code: ' + response.statusCode + ')');
        }
      });
  }
};
