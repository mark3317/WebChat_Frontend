const express = require("express");
const path = require("path");

const app = express();

// Middleware для установки MIME-типов
app.use((req, res, next) => {
  if (req.url.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  } else if (req.url.endsWith(".js")) {
    res.setHeader("Content-Type", "application/javascript");
  }
  next();
});

// Middleware для установки заголовка Content-Security-Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data:;"
  );
  next();
});

// Обслуживание статических файлов из папки
app.use(express.static(path.join(__dirname, "")));

// Добавление маршрута для корневого URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/html/index.html"));
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
