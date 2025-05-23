const WebSocket = require('ws');
const net = require('net');

const WS_PORT = process.env.WS_PORT || 5556; // Новый порт для WebSocket

const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('WebSocket клиент подключен');

  // Подключаемся к TCP-серверу
  const tcpClient = new net.Socket();
  tcpClient.connect(5555, 'localhost', () => {
    console.log('WebSocket сервер подключен к TCP-серверу');
  });

  // Пересылаем сообщения от WebSocket-клиента к TCP-серверу
  ws.on('message', (message) => {
    if (tcpClient.writable) {
      tcpClient.write(message.toString() + '\n');
    }
  });

  // Пересылаем сообщения от TCP-сервера к WebSocket-клиенту
  tcpClient.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data.toString());
    }
  });

  tcpClient.on('error', (err) => {
    console.error('Ошибка TCP-клиента:', err.message);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send('Ошибка: не удалось подключиться к TCP-серверу');
    }
  });

  tcpClient.on('end', () => {
    console.log('TCP-соединение закрыто');
    if (ws.readyState === WebSocket.OPEN) {
      ws.send('TCP-соединение закрыто');
    }
  });

  ws.on('close', () => {
    console.log('WebSocket клиент отключен');
    tcpClient.destroy();
  });

  ws.on('error', (err) => {
    console.error('Ошибка WebSocket:', err.message);
    tcpClient.destroy();
  });
});

console.log(`WebSocket сервер слушает порт ${WS_PORT}`);