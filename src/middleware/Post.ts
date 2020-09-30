import { PostDoc } from 'documents/Post';
import { isNull } from 'util';
import { UserDoc } from '../documents/User';
import PostSchema from '../models/Post';
import UserSchema from '../models/User';

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

	return await UserSchema.findOne({ _id: author._id }).then(async (user) => {
		let error;
		await user.posts.push(newPost as PostDoc);
		await user.save().catch((err) => {
			error = err;
		});
		await newPost.save().catch((err) => {
			error = err;
		});
		if (error) {
			return {
				status: 400,
				error: error,
				timeStamp: Date.now(),
			};
		} else {
			return {
				status: 201,
				post: newPost,
				timeStamp: Date.now(),
			};
		}
	});
}

export async function getAllPostsFromUser(handle: String) {
	let error;
	return await UserSchema.findOne({ handle: handle })
		.populate('posts')
		.then((result) => {
			if (!result) {
				error = 'There is no user with this handle';
			}

			if (result.posts.length === 0) {
				error = 'This user has no posts';
			}
			if (error) {
				return {
					status: 400,
					error: error,
					timeStamp: Date.now(),
				};
			} else {
				return {
					status: 200,
					posts: result.posts,
					timeStamp: Date.now(),
				};
			}
		});
}
