import UserSchema from '../models/User';
import * as argon2 from 'argon2';

export async function createUser(
	name: String,
	email: String,
	password: String
) {
	return await UserSchema.findOne({ email: email }).then(async (user) => {
		if (user) {
			return {
				status: 400,
				payload: 'Email was already taken',
			};
		} else {
			let hashedPassword;
			try {
				hashedPassword = await argon2.hash(password);
			} catch (error) {
				console.error(error);
			}
			const newUser = new UserSchema({
				name: name,
				email: email,
				password: hashedPassword,
				isAdmin: false,
				registerDate: Date.now(),
				lastUpdatedDate: Date.now(),
			});

			return await newUser
				.save()
				.then((user) => {
					return {
						status: 201,
						payload: user,
					};
				})
				.catch((err) => {
					return { status: 400, payload: err };
				});
		}
	});
}

export async function loginUser(email: String, password: string) {
	return await UserSchema.findOne({
		email: email,
	}).then((user) => {
		if (!user) {
			return {
				status: 400,
				payload: 'Wrong email or password',
			};
		} else {
			argon2.verify(user.password, password);
		}
	});
}
