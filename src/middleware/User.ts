import UserSchema from '../models/User';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import keys from '../config/keys';

export async function createUser(
	name: String,
	email: String,
	password: String,
	avatar?: String
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
				msg: 'Wrong email or password',
				token: null,
			};
		} else {
			return await argon2
				.verify(user.password as string, password as string)
				.then(async (result) => {
					if (result) {
						// TODO Give a token to the user !!!!
						const token = await jwt.sign(
							{
								id: user._id,
								name: user.name,
								avatar: user.avatar,
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
						};
					} else {
						return {
							status: 400,
							msg: 'Wrong email or password',
							token: null,
						};
					}
				});
		}
	});
}

export async function editUser(_id: String, fieldsToEdit: Object) {
	//Check the logged in user if she/he is the same person who is editing
	//Check if the user is admin, if she/he is admin then she/he can edit the profile coz admin...
	//Check the req.body if fields are the same as in the db, if yes, return something
	return {
		status: 200,
		payload: 'Fine',
	};
}

//Can I delete the return {status:200, payload: 'blabla'} and create only 1 at the top?
