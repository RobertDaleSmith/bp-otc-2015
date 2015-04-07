module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodewebkit: {
      options: {
        version: '0.12.0',
        buildDir: './builds', // Where the build version of my node-webkit app is saved
        macZip: false,
        macIcns: './www/nw.icns', // Path to the Mac icon file
        winIco: './www/favicon.ico',

        platforms: ['osx', 'win'] // These are the platforms that we want to build
        
      },
      src: './www/**/*' // Your node-webkit app
    },
    copy: {
      main: {
        files: [
          {
            src: 'libraries/win/ffmpegsumo.dll',
            dest: 'builds/bp-otc-2015/win32/ffmpegsumo.dll',
            flatten: true
          },
          {
            src: 'libraries/win/ffmpegsumo.dll',
            dest: 'builds/bp-otc-2015/win64/ffmpegsumo.dll',
            flatten: true
          },
          {
            src: 'libraries/mac/ffmpegsumo.so',
            dest: 'builds/bp-otc-2015/osx32/bp-otc-2015.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/ffmpegsumo.so',
            flatten: true
          },
          {
            src: 'libraries/mac/ffmpegsumo.so',
            dest: 'builds/bp-otc-2015/osx64/bp-otc-2015.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/ffmpegsumo.so',
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