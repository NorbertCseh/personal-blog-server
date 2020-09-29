import * as mongoose from 'mongoose';
import { UserDoc } from './User';

export interface PostDoc extends mongoose.Document {
	_id: Number;
	author: Number; //Maybe its wrong
	postTitle: String;
	postBody: String;
	createdDate: Number;
	lastUpdatedDate: Number;
}
