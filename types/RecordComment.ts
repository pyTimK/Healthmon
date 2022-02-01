import { Formatted } from "./../classes/MyUser";
import { FieldValue } from "firebase/firestore";

interface RecordComment {
	recordDate: string;
	patientID: string;
	recordTime: string;
	hasNotif: boolean;
	timestamp: FieldValue;
}

export const date_time_healthWorkerId = (comment: RecordComment, hwId: string) =>
	`${comment.recordDate}_${comment.recordTime}_${hwId}`;

export default RecordComment;

export const toFormattedComments = (comments: RecordComment[], hwId: string) => {
	const formattedComments = <Formatted<RecordComment>>{};
	for (const comment of comments) formattedComments[date_time_healthWorkerId(comment, hwId)] = comment;
	return formattedComments;
};
