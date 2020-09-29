import * as mongoose from 'mongoose';

export interface UserDoc extends mongoose.Document {
	_id: Number;
	name: String;
	email: String;
	handle: String;
	avatar: String;
	password: String;
	isAdmin: Boolean;
	registerDate: Number;
	lastUpdatedDate: Number;
}
