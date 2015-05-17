// jshint node: true
'use strict';

module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        browser: true,
        browserify: true,
        globals: {
          console: true,
          PIXI: true,
          Howl: true
        }
      },
      beforeconcat: {
        files: {
          src: ['public/js/src/**/*.js']
        }
      }
    },
    browserify: {
      main: {
        src: 'public/js/src/**/*.js',
        dest: 'public/js/dist/bundle.js'
      }
    },
    watch: {
      files: 'public/js/src/**/*',
      tasks: ['build']
    },
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      options: {
          logConcurrentOutput: true
      }
    },
    browserifyBower: {
      options: {
        file: 'public/js/dist/lib.js',
        forceResolve: {},
        shim: {}
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify-bower');
  
  // Default task(s).
  grunt.registerTask('build', ['jshint:beforeconcat', 'browserifyBower', 'browserify']);
  grunt.registerTask('default', ['build', 'concurrent:default']);
};
