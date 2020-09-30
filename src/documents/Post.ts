import * as mongoose from 'mongoose';
import { UserDoc } from './User';

export interface PostDoc extends mongoose.Document {
	_id: String;
	author: UserDoc;
	postTitle: String;
	postBody: String;
	createdDate: Number;
	lastUpdatedDate: Number;
}
