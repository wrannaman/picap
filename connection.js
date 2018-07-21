const io = require('socket.io-client');
const colors = require('./utility/colors');
const { host, port, protocol } = require('./config.json');
const connectionPath = `${protocol}://${host}:${port}`
console.log(colors.yellow(`Connecting to ${connectionPath}`));

let socket = null;

const setupSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  socket = io.connect(connectionPath, { transports: ['websocket', 'polling'], 'force new connection': true });
  socket.on('connect', () => {
    // socket connected
    console.log(colors.silly("PICAP connected to MOTHERSHIP"));

    // socket.emit('server custom event', { my: 'data' });
  });

  // socket.on('reconnect_attempt', () => {
  //   socket.io.opts.transports = ['polling', 'websocket'];
  // });

  socket.on('error', () => {
    console.log('err');
    console.log(colors.red('no connection to mothership'))
  })

  socket.on('disconnect', () => {
    console.log('dis');
    console.log(colors.red('disconnected from mothership'))
    setupSocket();
  });

  return socket;
};

module.exports = { setup: setupSocket(), getSocket: () => socket };
