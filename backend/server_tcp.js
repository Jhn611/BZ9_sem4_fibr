const net = require('net');

const PORT = process.env.TCP_PORT || 5555;

const server = net.createServer((socket) => {
  console.log('Клиент подключен:', socket.remoteAddress, socket.remotePort);

  socket.on('data', (data) => {
    const message = data.toString().trim();
    console.log('Получено:', message);
    socket.write(`Сервер получил: ${message}\n`);
  });

  socket.on('end', () => {
    console.log('Клиент отключен');
  });

  socket.on('error', (err) => {
    console.error('Ошибка сокета:', err.message);
  });
});

server.on('error', (err) => {
  console.error('Ошибка сервера:', err.message);
});

server.listen(PORT, () => {
  console.log(`TCP-сервер слушает порт ${PORT}`);
});