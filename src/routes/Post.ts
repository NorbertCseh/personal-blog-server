import { UserDoc } from '../documents/User';
import * as express from 'express';
const router = express.Router();
import * as passport from 'passport';
import {
	createPost,
	getAllPostsFromUser,
	getSinglePostById,
} from '../middleware/Post';

router.post(
	'/create-post',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		return await createPost(
			req.user as UserDoc,
			req.body.postTitle,
			req.body.postBody
		).then((response) => {
			res.status(response.status).json(response);
		});
	}
);

router.get(
	'/:_id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		return await getSinglePostById(req.params._id).then((response) => {
			res.status(response.status).json(response);
		});
	}
);

router.get(
	'/:handle/posts',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		return await getAllPostsFromUser(req.params.handle).then((response) => {
			res.status(response.status).json(response);
		});
	}
);

export default router;
