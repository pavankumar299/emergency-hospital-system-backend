let io;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('Dashboard connected:', socket.id);

    socket.on('join_hospital', (hospitalId) => {
      socket.join(hospitalId);
      socket.join('all_hospitals');
      console.log(`Socket joined: ${hospitalId}`);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
    });
  });

  return io;
};

const sendAlertToHospital = (hospitalId, alertData) => {
  if (io) {
    io.to('all_hospitals').emit('incoming_alert', alertData);
    console.log('Alert broadcast to all dashboards');
  }
};

module.exports = { initSocket, sendAlertToHospital };