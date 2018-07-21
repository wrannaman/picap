const socket = require('./connection');
const MPR121 = require('node-picap');
const mpr121 = new MPR121('0x5C', { interval: 30 });

// note that interval sets the interval (in ms) at which
// the module attempts to emit data events - the MPR121
// hardware sets a lower limit on this - default is 10ms,
// can set down to 1ms

mpr121.on('data', function(data) {
  // split out each of the various data streams...
  var touch = data.map(function(electrode) { return electrode.isTouched ? 1 : 0; });
  var tths  = data.map(function(electrode) { return electrode.touchThreshold; });
  var rths  = data.map(function(electrode) { return electrode.releaseThreshold; });
  var fdat  = data.map(function(electrode) { return electrode.filtered; });
  var bval  = data.map(function(electrode) { return electrode.baseline; });
  var diff  = data.map(function(electrode) { return electrode.baseline - electrode.filtered; });

  // ...and send them out via stdout - simples!
  touch.forEach((t, i) => {
    if (t) {
      console.log('sending index ', i);
      socket.emit('picap', { index: i });
    }
  })
  // console.log('TOUCH: ' + touch.join(' '));
  // console.log('TTHS: ' + tths.join(' '));
  // console.log('RTHS: ' + rths.join(' '));
  // console.log('FDAT: ' + fdat.join(' '));
  // console.log('BVAL: ' + bval.join(' '));
  // console.log('DIFF: ' + diff.join(' '));
});
