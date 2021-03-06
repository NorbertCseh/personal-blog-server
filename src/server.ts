import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';

import keys from './config/keys';

import userRoutes from './routes/User';
import postRoutes from './routes/Post';

const app = express();
const PORT = process.env.PORT || 3000;

async function main() {
	await mongoose
		.connect(keys.MongoURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		})
		.then(() => console.log('Database connected!'))
		.catch((err) => {
			console.error(err);
		});

	app.use(passport.initialize());
	require('./config/passport')(passport);

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use('/api/user', userRoutes);
	app.use('/api/post', postRoutes);

	await app.listen(PORT, () => {
		console.log(`App is listening on port: ${PORT}`);
	});
}
main();
