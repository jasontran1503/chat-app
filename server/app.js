const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configs/database');

dotenv.config({ path: './configs/.env' });
connectDB();

const authRouter = require('./routes/auth.route');
const chatRouter = require('./routes/chat.route');
const userRouter = require('./routes/user.route');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
	cors({
		origin: 'http://localhost:4200',
		allowedHeaders:
			'Origin, X-Requested-With, X-Api-Key, Content-Type, Accept, Authorization',
		methods: 'GET, POST, PUT, DELETE',
		credentials: true,
	})
);

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.json({
		success: false,
		message: err.message,
	});
});

const server = app.listen(process.env.PORT, function () {
	console.log('App listening on port ' + process.env.PORT);
});

const io = require('./helpers/socket').initIO(server);

io.on('connection', (socket) => {
	console.log('User connected!!!');

	socket.on('disconnect', () => {
		console.log('User disconnected!!!');
	});
});

module.exports = app;
