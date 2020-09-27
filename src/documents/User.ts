import * as mongoose from 'mongoose';

export interface UserDoc extends mongoose.Document {
	name: String;
	email: String;
	handle: String;
	avatar: String;
	password: String;
	isAdmin: String;
	registerDate: String;
	lastUpdatedDate: String;
}
