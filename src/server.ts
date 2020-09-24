import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import keys from './config/keys';

import userRoutes from './routes/User';

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

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use('/api/user', userRoutes);

	await app.listen(PORT, () => {
		console.log(`App is listening on port: ${PORT}`);
	});
}
main();
