import * as express from 'express';
const router = express.Router();
import {
	createUser,
	loginUser,
	editUser,
	getSingleUser,
	getAllUsers,
} from '../middleware/User';
import * as passport from 'passport';
import { UserDoc } from 'documents/User';

//Register
router.post('/register', (req, res) => {
	return createUser(
		req.body.name,
		req.body.email,
		req.body.handle,
		req.body.password,
		req.body.avatar
	)
		.then((response) => {
			return res
				.status(response.status)
				.json({ msg: response.payload, TimeStamp: Date.now() });
		})
		.catch((err) => {
			return res.json(err);
		});
});

//Login
router.post('/login', (req, res) => {
	return loginUser(req.body.email, req.body.password).then((response) => {
		return res.status(response.status).json({
			msg: response.msg,
			token: response.token,
			TimeStamp: Date.now(),
		});
	});
});

//Get all Users
router.get(
	'/users',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		return await getAllUsers().then(async (response) => {
			return await res.status(response.status).json({
				users: response.users,
				TimeStamp: Date.now(),
			});
		});
	}
);

//Get single User
router.get(
	'/:handle',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		return await getSingleUser(req.params.handle).then(async (response) => {
			return await res.status(response.status).json({
				msg: response.payload,
				TimeStamp: Date.now(),
			});
		});
	}
);

//Edit user
router.put(
	'/:handle',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		return await editUser(
			req.user as UserDoc,
			req.body,
			req.params.handle
		).then(async (response) => {
			return await res.status(response.status).json({
				msg: response.msg,
				user: response.user,
				TimeStamp: Date.now(),
			});
		});
	}
);

export default router;
