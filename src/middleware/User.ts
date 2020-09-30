import UserSchema from '../models/User';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import keys from '../config/keys';
import { UserDoc } from '../documents/User';

export async function createUser(
	name: String,
	email: String,
	handle: String,
	password: String,
	avatar?: String
) {
	return await UserSchema.findOne({ email: email }).then(async (user) => {
		if (user) {
			return {
				status: 400,
				error: 'Email was already taken',
				TimeStamp: Date.now(),
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
				handle: handle,
				avatar: avatar,
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
						user: user,
						TimeStamp: Date.now(),
					};
				})
				.catch((err) => {
					return { status: 400, error: err };
				});
		}
	});
}

export async function loginUser(email: String, password: String) {
	return await UserSchema.findOne({
		email: email,
	})
		.select('+password')
		.then(async (user) => {
			if (!user) {
				return {
					status: 400,
					error: 'Wrong email or password',
					TimeStamp: Date.now(),
				};
			} else {
				return await argon2
					.verify(user.password as string, password as string)
					.then(async (result) => {
						if (result) {
							const token = await jwt.sign(
								{
									id: user._id,
									name: user.name,
									avatar: user.avatar,
									isAdmin: user.isAdmin,
								},
								keys.secretOrKey,
								{
									expiresIn: 3600,
								}
							);
							return {
								status: 200,
								msg: 'Access granted, now you are logged in.',
								token: 'Bearer ' + token,
								TimeStamp: Date.now(),
							};
						} else {
							return {
								status: 400,
								error: 'Wrong email or password',
								TimeStamp: Date.now(),
							};
						}
					});
			}
		});
}

export async function editUser(
	requestedUser: UserDoc,
	fieldsToEdit: UserDoc,
	handle: String
) {
	const requestedPerson = await UserSchema.findById(requestedUser._id).then(
		(user) => {
			return user;
		}
	);
	let userToEdit = await UserSchema.findOne({ handle: handle }).then(
		(user) => {
			return user;
		}
	);

	if (JSON.stringify(requestedPerson) === JSON.stringify(userToEdit)) {
		if (fieldsToEdit.name) {
			userToEdit.name = fieldsToEdit.name;
		}
		if (fieldsToEdit.email) {
			userToEdit.email = fieldsToEdit.email;
		}
		if (fieldsToEdit.handle) {
			userToEdit.handle = fieldsToEdit.handle;
		}
		if (fieldsToEdit.avatar) {
			userToEdit.avatar = fieldsToEdit.avatar;
		}
		if (fieldsToEdit.password) {
			userToEdit.password = fieldsToEdit.password;
		}
		userToEdit.lastUpdatedDate = Date.now();
		userToEdit.save();
		return {
			status: 200,
			msg: 'User updated.',
			user: userToEdit,
			TimeStamp: Date.now(),
		};
	} else {
		return {
			status: 401,
			error: 'You cannot edit this user.',
			TimeStamp: Date.now(),
		};
	}
}

export async function getSingleUser(handle: String) {
	return await UserSchema.findOne({ handle: handle })
		.then((user) => {
			if (!user) {
				return {
					status: 400,
					error: 'This is not the page that you are looking for!',
					TimeStamp: Date.now(),
				};
			} else {
				return {
					status: 200,
					user: user,
					TimeStamp: Date.now(),
				};
			}
		})
		.catch((err) => {
			return {
				status: 400,
				error: err,
				TimeStamp: Date.now(),
			};
		});
}

export async function getAllUsers() {
	return await UserSchema.find().then((users) => {
		return {
			status: 200,
			users: users,
			TimeStamp: Date.now(),
		};
	});
}

//Can I delete the return {status:200, payload: 'blabla'} and create only 1 at the top?
