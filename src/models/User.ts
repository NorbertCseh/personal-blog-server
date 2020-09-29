import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserDoc } from '../documents/User';

const UserSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	handle: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
		required: false,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	isAdmin: {
		type: Boolean,
		required: true,
	},
	registerDate: {
		type: Date,
		required: true,
	},
	lastUpdatedDate: {
		type: Date,
		required: true,
	},
});

export default mongoose.model<UserDoc>('User', UserSchema);
