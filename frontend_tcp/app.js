let socket;

function connectToServer() {
  // Подключаемся к WebSocket-серверу через localhost, так как код выполняется в браузере
  socket = new WebSocket('ws://localhost:5556');

  socket.onopen = () => {
    console.log('Подключено к WebSocket-серверу');
    addResponse('Подключено к серверу');
  };

  socket.onmessage = (event) => {
    addResponse(event.data);
  };

  socket.onerror = (error) => {
    console.error('Ошибка сокета:', error);
    addResponse('Ошибка: не удалось подключиться');
  };

  socket.onclose = () => {
    console.log('Отключено от WebSocket-сервера');
    addResponse('Отключено от сервера');
  };
}

function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();
  if (message && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    addResponse(`Отправлено: ${message}`);
    messageInput.value = '';
  } else {
    addResponse('Ошибка: нет подключения к серверу');
  }
}

function addResponse(message) {
  const responseArea = document.getElementById('responseArea');
  responseArea.innerHTML += `<p>${message}</p>`;
  responseArea.scrollTop = responseArea.scrollHeight;
}

// Подключение к серверу при загрузке страницы
window.onload = connectToServer;