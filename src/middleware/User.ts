import UserSchema from '../models/User';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import keys from '../config/keys';
import { UserDoc } from 'documents/User';

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

export async function editUser(requestedUser: any, fieldsToEdit: any) {
	//PLS GOD CHANGE THE ANY!!!!

	//Check the logged in user if she/he is the same person who is editing
	//Check if the user is admin, if she/he is admin then she/he can edit the profile coz admin... DO I NEED THIS?
	//Check the req.body if fields are the same as in the db, if yes, return something
	return await UserSchema.findOne({ email: requestedUser.email }).then(
		async (user) => {
			console.log('Requested user: ', requestedUser);

			console.log('Fields to edit: ', fieldsToEdit);

			console.log('User: ', user);
			console.log((requestedUser._id as String) === (user._id as String));
			console.log('UserID: ', user._id);
			console.log('RequestedID: ', requestedUser._id);

			//Somethings are not okey here, pls Check, maybe it's the ANY?

			if (requestedUser._id === user._id) {
				//Do the change
				if (fieldsToEdit.name) {
					user.name = fieldsToEdit.name;
				}
				if (fieldsToEdit.email) {
					user.email = fieldsToEdit.email;
				}
				if (fieldsToEdit.handle) {
					user.handle = fieldsToEdit.handle;
				}
				if (fieldsToEdit.avatar) {
					user.avatar = fieldsToEdit.avatar;
				}
				if (fieldsToEdit.password) {
					user.password = fieldsToEdit.password;
				}
				user.save();
				console.log('New user: ', user);
				return {
					status: 200,
					msg: 'User updated.',
					user: user,
				};
			} else {
				return {
					status: 401,
					msg: 'You cannot edit this user.',
				};
			}
		}
	);
}

export async function getSingleUser(handle: String) {
	//Check the logged in user if she/he is the same person who is editing
	//Check if the user is admin, if she/he is admin then she/he can edit the profile coz admin...
	//Check the req.body if fields are the same as in the db, if yes, return something

	return await UserSchema.findOne({ handle: handle })
		.then((user) => {
			if (!user) {
				return {
					status: 400,
					payload: 'This is not the page that you are looking for!',
				};
			} else {
				return {
					status: 200,
					payload: {
						_id: user._id,
						email: user.email,
						handle: handle,
						name: user.name,
						avatar: user.avatar,
						registerDate: user.registerDate,
					},
				};
			}
		})
		.catch((err) => {
			return {
				status: 400,
				payload: err,
			};
		});
}

//Can I delete the return {status:200, payload: 'blabla'} and create only 1 at the top?
