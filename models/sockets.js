const Marcadores = require("./marcadores");

class Sockets {
	constructor(io) {
		this.io = io;

		this.marcadores = new Marcadores();

		this.socketEvents();
	}

	socketEvents() {
		// On connection
		this.io.on("connection", (socket) => {
			socket.emit("marcadores-activos", this.marcadores.activos);

			socket.on("marcador-nuevo", (marcador) => {
				this.marcadores.agregarMarcador(marcador);

				//hacemos un broadcast para que todas las eprsonas excepto la que coloco el marcador, vean tambien ese marcador
				//el backend emitiendo nuevamente la respuesta
				socket.broadcast.emit("marcador-nuevo", marcador);
			});

			//para el movimiento del marcador
			socket.on("marcador-actualizado", (marcador) => {
				this.marcadores.actualizarMarcador(marcador);
				socket.broadcast.emit("marcador-actualizado", marcador);
			});
		});
	}
}

module.exports = Sockets;
