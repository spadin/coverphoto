/*
 * grunt-eco-amd
 * https://github.com/grundjoseph/grunt-eco-amd
 *
 * Copyright (c) 2012 Joe Grund
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('eco_amd', 'Compile Eco files into Define wrapped JS files', function () {
    this.requiresConfig('eco_amd');

    var path = require('path');

    var helpers = require('grunt-contrib-lib').init(grunt);

    var basePath;

    var srcFiles;

    var newFileDest;

    var options = helpers.options(this, {
      basePath: false
    });

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    this.files.forEach(function (file) {
        file.dest = path.normalize(file.dest);
        srcFiles = grunt.file.expandFiles(file.src);

        basePath = helpers.findBasePath(srcFiles, options.basePath);
        
        srcFiles.forEach(function (srcFile) {
          newFileDest = helpers.buildIndividualDest(file.dest, srcFile, basePath)
          
          compileEco(srcFile, function (compiled) {
            grunt.file.write(newFileDest, compiled)
          }); 
        });
    });
  });

  var compileEco = function(srcFile, callback) {
    var indent = require('eco/lib/util').indent;
    var source = grunt.file.read(srcFile);
    var compiled = 'define(function () {\nreturn ' + indent(require('eco').precompile(source), 2).slice(2) + ' \n});\n';
    
    callback(compiled);
  };
};