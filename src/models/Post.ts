import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

const PostSchema: Schema = new Schema({
	// _id:{
	// 	type:Schema.Types.ObjectId,
	// 	required:
	// },
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	postTitle: {
		type: String,
		required: true,
	},
	postBody: {
		type: String,
		required: true,
	},
	createdDate: {
		type: Date,
		required: true,
	},
	lastUpdatedDate: {
		type: Date,
		required: true,
	},
});

export default mongoose.model('Post', PostSchema);
