const { validateJWT } = require('../helpers');

const ChatMensajes = require('../models/chat-mensajes');

const chatMensajes = new ChatMensajes();

const socketController = async(socket, io) => {
    const user = await validateJWT(socket.handshake.headers['x-token']);
    if (!user) {
        return socket.disconnect();
    }

    console.log(`Se conecto el usuario [${ user.name }] con id de socket [${ socket.id }]...`);

    // Agrego el usuario conectado...
    chatMensajes.conectarUsuario(user);

    // Con el IO emito a todo el mundo...
    io.emit('usuarios-activos', chatMensajes.usuariosArr);

    // Actualizo el chat...
    socket.emit('recibir-mensaje', chatMensajes.ultimos10);

    // Lo conecto a una sala especial...
    socket.join(user.id);

    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(user.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        if (uid) {
            // Mensaje privado...
            socket.to(uid).emit('mensaje-privado', {
                de: user.nombre,
                mensaje
            });
        } else {
            // Mensaje global...
            chatMensajes.enviarMensajea(user.id, user.name, mensaje);
    
            io.emit('recibir-mensaje', chatMensajes.ultimos10);
        }
    });
}

module.exports = {
    socketController
}
