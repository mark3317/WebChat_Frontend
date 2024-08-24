module.exports = {
  proxy: "localhost:8080", // Прокси-сервер вашего приложения
  files: ["src/**/*.{html,css,js}"], // Файлы для отслеживания изменений
  port: 3000, // Порт для BrowserSync
  open: true,
  notify: false,
};
