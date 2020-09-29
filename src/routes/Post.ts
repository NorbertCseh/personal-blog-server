import { UserDoc } from '../documents/User';
import * as express from 'express';
const router = express.Router();
import * as passport from 'passport';
import { createPost } from '../middleware/Post';

router.get;

router.post(
	'/create-post',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		return await createPost(
			req.user as UserDoc,
			req.body.postTitle,
			req.body.postBody
		).then((response) => {
			res.status(response.status).json({
				payload: response.payload,
				timeStamp: Date.now(),
			});
		});
	}
);

export default router;
