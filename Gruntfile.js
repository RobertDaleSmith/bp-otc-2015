module.exports = function(grunt) {

  grunt.initConfig({
    nodewebkit: {
      options: {
        version: '0.12.0',
        buildDir: './build', // Where the build version of my node-webkit app is saved
        macZip: false,
        macIcns: './www/nw.icns', // Path to the Mac icon file
        winIco: './www/favicon.ico',

        platforms: ['osx', 'win'] // These are the platforms that we want to build
        
      },
      src: './www/**/*' // Your node-webkit app
    },
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['nodewebkit']);

};