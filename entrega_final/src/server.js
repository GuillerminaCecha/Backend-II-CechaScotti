import express from "express";
import handlebars from "./config/handlebars.config.js";
import productsRouter from "./routes/api.products.router.js";
import cartsRouter from "./routes/api.carts.router.js";
import paths from "./utils/paths.js";
import productsViewRouter from "./routes/app.products.router.js";
import cartViewRouter from "./routes/app.cart.router.js";
import serverSocket from "./config/socket.config.js";
import mongoDB from "./config/mongoose.config.js";


const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const loginRouter = require('./routes/login');
const currentRouter = require('./routes/current');
require('./config/passport'); // Configuración de Passport


const server = express();
const PORT = 8080;
const HOST = "localhost";

const app = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/", productsViewRouter);
server.use("/", cartViewRouter);
server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);

server.use(express.static(paths.public));

handlebars.config(server);

// Configurar sesión
app.use(session({
    secret: 'tu_clave_secreta',
    resave: false,
    saveUninitialized: false
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Usar rutas
app.use('/api/sessions', loginRouter);
app.use('/api/sessions', currentRouter);


server.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL no existe en este servidor</h3>");
});

server.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send("<h1>Error 500</h1><h3>Se ha producido un error</h3>");
});

const serverHTTP = server.listen(PORT, () => {
    console.log(`Servidor en http://${HOST}:${PORT}`) ;
    mongoDB.connectDB();
});

serverSocket.config(serverHTTP);