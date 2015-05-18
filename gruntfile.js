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
          src: ['public/b9/js/src/**/*.js']
        }
      }
    },
    browserify: {
      main: {
        src: 'public/b9/js/src/**/*.js',
        dest: 'public/b9/js/dist/bundle.js'
      }
    },
    watch: {
      files: 'public/b9/js/src/**/*',
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
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  // Default task(s).
  grunt.registerTask('build', ['jshint:beforeconcat', 'browserify']);
  grunt.registerTask('default', ['build', 'concurrent:default']);
};
