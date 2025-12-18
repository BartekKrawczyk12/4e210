const express = require('express');
const path = require('path');
const router = require('./routes');  // <-- ładuje src/routes/index.js

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// użycie routera
app.use('/', router);

// 404 handler
app.use((req, res) => {
    res.status(404).render('pages/error/404');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Wystąpił błąd serwera';
    const showDetails = req.app.get('env') !== 'production';
    res.status(status).render('pages/error/error', {
        status,
        message,
        errorDetails: showDetails ? err : null
    });
});

module.exports = app;
