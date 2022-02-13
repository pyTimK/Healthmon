import { RecordMetaData } from "./../components/record/Record";
import { RecordCommentNotif } from "./Notification";
import { Formatted, HealthWorker } from "./../classes/MyUser";
import { FieldValue } from "firebase/firestore";

interface UserComment {
	recordDate: string;
	patientId: string;
	recordTime: string;
	hasNotif: boolean;
	timestamp: FieldValue;
}

export default UserComment;

export const date_time_healthWorkerId = (comment: UserComment | RecordMetaData, hwId: string) =>
	`${comment.recordDate}_${comment.recordTime}_${hwId}`;

export const date_time_healthWorkerId_from_recordCommentNotif = (recordCommentNotif: RecordCommentNotif) =>
	`${recordCommentNotif.recordDate}_${recordCommentNotif.recordTime}_${recordCommentNotif.sender.id}`;

export const date_time_patientId = (recordMetaData: RecordMetaData) =>
	`${recordMetaData.recordDate}_${recordMetaData.recordTime}_${recordMetaData.patientId}`;

export const date_time_patientId_from_recordCommentNotif = (
	recordCommentNotif: RecordCommentNotif,
	patientId: string
) => `${recordCommentNotif.recordDate}_${recordCommentNotif.recordTime}_${patientId}`;

export const toFormattedComments = (comments: UserComment[], hwId: string) => {
	const formattedComments = <Formatted<UserComment>>{};
	for (const comment of comments) formattedComments[date_time_healthWorkerId(comment, hwId)] = comment;
	return formattedComments;
};

export interface RecordComment {
	sender: HealthWorker;
	comment: string;
	timestamp: FieldValue;
}
