import * as mongoose from 'mongoose';

export interface UserDoc extends mongoose.Document {
	name: {
		type: String;
		required: Boolean;
	};
	email: {
		type: String;
		required: Boolean;
		unique: Boolean;
	};
	password: {
		type: String;
		required: Boolean;
	};
	isAdmin: {
		type: Boolean;
		required: Boolean;
	};
	registerDate: {
		type: Date;
		required: Boolean;
	};
	lastUpdatedDate: {
		type: Date;
		required: Boolean;
	};
}
