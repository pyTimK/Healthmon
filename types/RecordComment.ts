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

export const date_time_healthWorkerId = (comment: UserComment, hwId: string) =>
	`${comment.recordDate}_${comment.recordTime}_${hwId}`;

export const date_time_patientId = (comment: UserComment) =>
	`${comment.recordDate}_${comment.recordTime}_${comment.patientId}`;

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
