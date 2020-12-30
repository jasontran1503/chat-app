let io;

module.exports = {
	/**
	 * Init io
	 */
	initIO: (server) => {
		io = require('socket.io')(server, {
			cors: {
				origin: 'http://localhost:4200',
				allowedHeaders:
					'Origin, X-Requested-With, X-Api-Key, Content-Type, Accept, Authorization',
				methods: 'GET, POST, PUT, DELETE',
				credentials: true,
			},
		});
		return io;
	},

	/**
	 * Get io
	 */
	getIO: () => {
		if (!io) {
			throw new Error('Kết nối bị gián đoạn.');
		}
		return io;
	},
};
