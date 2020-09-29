import { UserDoc } from '../documents/User';
import PostSchema from '../models/Post';

export async function createPost(
	author: UserDoc,
	postTitle: String,
	postBody: String
) {
	const newPost = new PostSchema({
		author: author._id,
		postTitle: postTitle,
		postBody: postBody,
		createdDate: Date.now(),
		lastUpdatedDate: Date.now(),
	});

	return await newPost
		.save()
		.then((post) => {
			return {
				status: 200,
				payload: post,
			};
		})
		.catch((err) => {
			return {
				status: 400,
				payload: err,
			};
		});
}
