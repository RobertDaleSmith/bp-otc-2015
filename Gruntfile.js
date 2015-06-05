module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodewebkit: {
      options: {
        version: '1.1',
        buildDir: './builds', // Where the build version of my node-webkit app is saved
        macZip: false,
        macIcns: './www/icon.icns', // Path to the Mac icon file
        winIco: './www/favicon.ico',

        platforms: ['osx', 'win'] // These are the platforms that we want to build
        
      },
      src: './www/**/*' // Your node-webkit app
    },
    copy: {
      main: {
        files: [
          {
            src: 'data.json',
            dest: 'builds/bp-otc-2015/win32/data.json',
            flatten: true
          },
          {
            src: 'data.json',
            dest: 'builds/bp-otc-2015/win64/data.json',
            flatten: true
          },
          {
            src: 'data.json',
            dest: 'builds/bp-otc-2015/osx32/bp-otc-2015.app/Contents/data.json',
            flatten: true
          },
          {
            src: 'data.json',
            dest: 'builds/bp-otc-2015/osx64/bp-otc-2015.app/Contents/data.json',
            flatten: true
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['nodewebkit', 'copy']);

};