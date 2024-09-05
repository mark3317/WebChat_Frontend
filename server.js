const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const express = require("express");
const path = require("path");
const app = express();

// Установка заголовка CSP
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5000; img-src 'self' data:; connect-src 'self' http://94.242.53.252:8081  ws://localhost:5000 ws://94.242.53.252:8081; style-src 'self' 'unsafe-inline'; font-src 'self';"
  );
  next();
});

// Использование connect-livereload middleware
app.use(
  connectLivereload({
    port: 5000, // Укажите тот же порт, что и в livereload-config.js
  })
);

// Обслуживание статических файлов из папки
app.use(express.static(path.join(__dirname, "")));

// Добавление маршрута для корневого URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/html/index.html"));
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

// Настройка LiveReload сервера с указанием порта
const liveReloadServer = livereload.createServer({
  port: 5000, // Укажите желаемый порт
});
liveReloadServer.watch([
  path.join(__dirname, "dist"),
  path.join(__dirname, "src/**/*.html"),
  path.join(__dirname, "src/**/*.css"),
  path.join(__dirname, "src/**/*.js"),
]);

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

console.log("LiveReload сервер запущен на порту 5000");
