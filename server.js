const express = require('express'); // Express для создания веб-сервера
const http = require('http'); // HTTP модуль для создания сервера
const path = require('path'); // Path модуль для работы с путями файловой системы
const readline = require('readline'); // Readline модуль для чтения ввода с клавиатуры
const sockjs = require('sockjs');
const StompServer = require('stomp-broker-js');

//*Создаем экземпляр приложения Express
const app = express();
//*Создаем HTTP сервер на основе Express приложения
const server = http.createServer(app);

//todoCSP SECURITY 
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net");
  next();
});

//Обслуживание статических файлов, включая favicon.ico
app.use(express.static(path.join(__dirname, 'public')));

//? Создаем SockJS сервер
const sockjsServer = sockjs.createServer();
sockjsServer.installHandlers(server, { prefix: '/ws' });

//? Создаем STOMP сервер
const stompServer = new StompServer({ server: sockjsServer });

//* Обработка подключения и отключения клиентов
stompServer.on('connect', (sessionId, headers) => {
    console.log(`Client connected: ${sessionId}`);
});

stompServer.on('disconnect', (sessionId) => {
    console.log(`Client disconnected: ${sessionId}`);
});

//* Обработка подписки и отписки клиентов
stompServer.on('subscribe', (msg, headers) => {
    console.log(`Subscribed: ${headers.destination}`);
});

stompServer.on('unsubscribe', (msg, headers) => {
    console.log(`Unsubscribed: ${headers.destination}`);
});

//* Обработка отправки сообщений
stompServer.on('send', (msg, headers) => {
    console.log(`Message sent to ${headers.destination}: ${msg}`);
});

// Запуск сервера
const PORT = process.env.PORT || 8082;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//todo ОБРАБОТКА АВТОРИЗАЦИИ НА СЕРВЕРЕ 
stompServer.on('send', (msg, headers) => {
  const message = JSON.parse(msg);
  if (headers.destination === '/app/auth') {
      const { login, password } = message;

      // Простая проверка логина и пароля
      if (login === 'user' && password === 'password') {
          stompServer.send(`/user/${headers.session}/queue/auth`, {}, JSON.stringify({ success: true }));
      } else {
          stompServer.send(`/user/${headers.session}/queue/auth`, {}, JSON.stringify({ success: false }));
      }
  }
});

//! ЛОГИКА ЗАКРЫТИЯ СЕРВЕРА КОМАНДОЙ 'shutdown'

// Настраиваем readline для прослушивания ввода с клавиатуры
const rl = readline.createInterface({
  input: process.stdin, // Ввод с клавиатуры
  output: process.stdout // Вывод в консоль
});

// Обрабатываем событие ввода строки с клавиатуры
rl.on('line', (input) => {
  // Если введена команда 'shutdown'
  if (input.trim() === 'shutdown') {
    console.log('Shutting down server...');

    // Закрываем все WebSocket соединения
    wss.clients.forEach((client) => {
      client.close(); // Закрываем соединение
    });

    // Закрываем HTTP сервер
    server.close(() => {
      console.log('Server has been shut down.');
      process.exit(0); // Завершаем процесс
    });
  }
});