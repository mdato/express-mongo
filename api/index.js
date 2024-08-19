const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv').config();
const connectDb = require('./config/connectionDb');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 9000;

connectDb();

// Configura el motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configura los middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Configura las rutas antes de los archivos estáticos
app.use('/', require('./routes/staticRouter'));
app.use('/album', require('./routes/album'));

// Configura la carpeta para archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`running on port: ${PORT}`);
    }
});
