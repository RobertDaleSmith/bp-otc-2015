var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
    files: 'www/**/**', // use the glob format
    platforms: ['osx32', 'osx64', 'win32', 'win64'],
    macIcns: 'www/nw.icns',
    macZip: false,
    winIco: 'www/favicon.ico'

});

//Log stuff you want

nw.on('log', console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});