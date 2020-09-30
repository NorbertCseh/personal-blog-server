import { timeStamp } from 'console';
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

		//We have to save inside the User table if we want to populate children below
		//If you want to populate the user from the post, we don't need to save in the user also
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

export async function getSinglePostById(_id: any) {
	return await PostSchema.findById(_id)
		.populate('author')
		.then((post) => {
			if (!post) {
				return {
					status: 400,
					error: 'This post does not exists',
					timeStamp: Date.now(),
				};
			} else {
				return {
					status: 200,
					post: post,
					timeStamp: Date.now(),
				};
			}
		})
		.catch((err) => {
			//Id check by Mongoose: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
			//Thats why it throws error on shorter _ids
			return {
				status: 400,
				error: 'This post does not exists 2',
				timeStamp: Date.now(),
			};
		});
}
