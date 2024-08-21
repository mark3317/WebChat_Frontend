const express = require('express');
const app = express();
const path = require('path');

// Обслуживание статических файлов из папки 'dist'
app.use('/dist', express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Добавление маршрута для корневого URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/index.html')); 
});
// Маршрут для mainchat.html
app.get('/mainchat', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/mainchat.html'));
});

// Маршрут для register.html
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/register.html'));
});
//Запуск сервера
app.listen(8082, () => {
    console.log('Server is running on http://localhost:8082');
});