import * as mongoose from 'mongoose';
import { PostDoc } from './Post';

export interface UserDoc extends mongoose.Document {
	_id: Number;
	name: String;
	email: String;
	handle: String;
	avatar: String;
	password: String;
	isAdmin: Boolean;
	posts: Array<PostDoc>;
	registerDate: Number;
	lastUpdatedDate: Number;
}
