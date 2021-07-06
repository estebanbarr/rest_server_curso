const express = require('express');
const cors    = require('cors');

const { dbConnect } = require('../database/config');

class Server {
    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.usersPath = '/api/user';

        // Conexion a la base de datos...
        this.connectDB();
        
        // Middlewares...
        this.middlewares();

        // Rutas de mi aplicacion...
        this.routes();
    }

    async connectDB() {
        await dbConnect();
    }

    middlewares() {
        // CORS...
        this.app.use(cors());

        // Lectura y parseo del body...
        this.app.use(express.json());

        // Servir contenido estatico...
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.usersPath, require('../routes/user'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;
