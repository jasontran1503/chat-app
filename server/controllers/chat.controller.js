const Message = require('../models/Message');
const User = require('../models/User');
const Room = require('../models/Room');
const io = require('../helpers/socket');

module.exports = {
	/**
	 * Create room
	 * @route POST api/chat/chat-room
	 * @body userId
	 */
	createRoom: async (req, res, next) => {
		const roomUsers = [];

		try {
			if (req.user._id.equals(req.body.userId)) {
				throw new Error('Có lỗi xảy ra!');
			}
			roomUsers.push(req.body.userId);
			roomUsers.push(req.user._id);

			const availableRoom = await Room.findOne({
				users: { $all: [...roomUsers] },
			}).populate({
				path: 'users',
				select: ['username avatar'],
			});

			if (availableRoom) {
				return res.status(200).json({
					success: true,
					message: 'Room đã tồn tại.',
					data: availableRoom,
				});
			}

			const newRoom = new Room({
				users: roomUsers,
			});

			await newRoom.save();

			return res.status(200).json({
				success: true,
				message: 'Thêm thành công.',
				data: newRoom,
			});
		} catch (error) {
			next(error);
		}
	},

	/**
	 * Get available rooms
	 * @route GET api/chat/available-rooms
	 */
	getAvailableRooms: async (req, res, next) => {
		try {
			const rooms = await Room.find({
				users: { $all: req.user._id },
			})
				.populate({
					path: 'users',
					select: ['username', 'avatar'],
				})
				.lean();

			rooms.map((room) => {
				let friendChat;
				if (room.users[0].username === req.user.username) {
					friendChat = room.users[1];
				} else {
					friendChat = room.users[0];
				}
				room.friendChat = friendChat;
			});

			return res.status(200).json({
				success: true,
				message: 'Thêm thành công.',
				data: rooms,
			});
		} catch (error) {
			next(error);
		}
	},

	/**
	 * Get room info
	 * @route GET api/chat/room
	 * @queryParams roomId
	 */
	getRoomInfo: async (req, res, next) => {
		const roomId = req.query.roomId;

		try {
			const room = await Room.findById(roomId).populate(
				'users',
				'username avatar'
			);

			if (!room) {
				throw new Error('Phòng chat không tồn tại.');
			}
			return res.status(200).json({
				success: true,
				message: '',
				data: room,
			});
		} catch (error) {
			next(error);
		}
	},

	/**
	 * Create new message
	 * @route POST api/chat/new-message
	 * @body message, receiver, roomId
	 */
	createMessage: async (req, res, next) => {
		const { message, roomId } = req.body;
		req.body.sender = req.user._id;

		try {
			const _sender = await User.findById(req.body.sender);
			const _room = await Room.findById(roomId);

			if (!_sender) {
				throw new Error('Không tìm thấy người gửi.');
			}
			if (!_room) {
				throw new Error('Không tìm thấy phòng chat.');
			}
			if (_sender && _room) {
				const newMessage = await Message.create(req.body);
				io.getIO().emit('new-message', {
					message,
					createdBy: req.user,
				});

				return res.status(200).json({
					success: true,
					message: 'Thêm thành công.',
					data: newMessage,
				});
			}
		} catch (error) {
			next(error);
		}
	},

	/**
	 * Get conversation
	 * @route GET api/chat/conversation
	 * @queryParams roomId
	 */
	getConversation: async (req, res, next) => {
		const { roomId } = req.query;

		try {
			const conversation = await Message.find({
				roomId,
			})
				.populate('sender', 'username avatar')
				.populate('receiver', 'username avatar')
				.sort({ createdAt: 1 });

			return res.status(200).json({
				success: true,
				message: 'Thành công.',
				data: conversation,
			});
		} catch (error) {
			next(error);
		}
	},
};
