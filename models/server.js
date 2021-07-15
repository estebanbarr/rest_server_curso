const express    = require('express');
const cors       = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnect } = require('../database/config');

class Server {
    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.path = {
            auth    : '/api/auth',
            category: '/api/category',
            product : '/api/product',
            search  : '/api/search',
            upload  : '/api/upload',
            users   : '/api/user'
        };

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

        // Carga de archivos...
        this.app.use(fileUpload({
            useTempFiles    : true,
            tempFileDir     : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.path.auth    , require('../routes/auth'));
        this.app.use(this.path.category, require('../routes/category'));
        this.app.use(this.path.product , require('../routes/product'));
        this.app.use(this.path.search  , require('../routes/search'));
        this.app.use(this.path.users   , require('../routes/user'));
        this.app.use(this.path.upload  , require('../routes/upload'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;
