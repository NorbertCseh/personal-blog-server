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
				hashedPassword = await argon2.hash(password as string);
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

export async function loginUser(email: String, password: String) {
	return await UserSchema.findOne({
		email: email,
	}).then(async (user) => {
		if (!user) {
			return {
				status: 400,
				payload: 'Wrong email or password',
			};
		} else {
			return await argon2
				.verify(user.password as string, password as string)
				.then((result) => {
					if (result) {
						// TODO Give a token to the user
						return {
							status: 200,
							payload: 'Access granted, now you are logged in.',
						};
					} else {
						return {
							status: 400,
							payload: 'Wrong email or password',
						};
					}
				});
		}
	});
}

//Can I delete the return {status:200, payload: 'blabla'} and create only 1 at the top?
