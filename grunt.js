/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:coverphoto.jquery.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:build/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      app: {
        src: ['build/tmp/coverphoto-templates.js', 'build/tmp/coverphoto-plugin.js'],
        dest: 'build/coverphoto.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    lint: {
      files: ['grunt.js', 'test/**/*.js']
    },
    watch: {
      files: ['<config:lint.files>','<config:coffeelint.app.files>','src/templates/**/*.jst','src/stylesheets/coverphoto.less'],
      tasks: 'coffee jst concat:app clean:app less lint coffeelint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {},
    coffee: {
      compile: {
        files: {
          'build/tmp/coverphoto-plugin.js': ['<config:coffeelint.app.files>']
        }
      }
    },
    coffeelint: {
      app: {
        files: ['src/**/*.coffee']
      }
    },
    jst: {
      app: {
        options: {
          namespace: 'CoverPhotoTemplates'
        },
        files: {
          'build/tmp/coverphoto-templates.js': ['src/templates/**/*.jst']
        }
      }
    },
    clean: {
      app: {
        src: ["build/tmp"]
      }
    },
    less: {
      app: {
        files: {
          'build/coverphoto.css': ['src/stylesheets/coverphoto.less']
        }
      }
    },
    copy: {
      dist: {
        files: {
          "dist/coverphoto.css": "build/coverphoto.css"
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'coffee jst concat:app clean:app less lint qunit concat:dist min copy');
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-coffeelint');
};
