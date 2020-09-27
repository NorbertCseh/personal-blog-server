import * as express from 'express';
const router = express.Router();
import {
	createUser,
	loginUser,
	editUser,
	getSingleUser,
} from '../middleware/User';
import * as passport from 'passport';

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
				.json({ msg: response.payload, dateTime: Date.now() });
		})
		.catch((err) => {
			return res.json(err);
		});
});

router.post('/login', (req, res) => {
	return loginUser(req.body.email, req.body.password).then((response) => {
		return res.status(response.status).json({
			msg: response.msg,
			token: response.token,
			dateTime: Date.now(),
		});
	});
});

router.get(
	'/:handle',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		return getSingleUser(req.params.handle).then((response) => {
			return res.status(response.status).json({
				msg: response.payload,
				dateTime: Date.now(),
			});
		});
	}
);

export default router;
