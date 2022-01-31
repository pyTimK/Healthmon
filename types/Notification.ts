import { FieldValue } from "firebase/firestore";
export const enum NotifSubject {
	MonitorRequest = "monitor_request",
	RecordComment = "record_comment",
}

interface Notification {
	timestamp: FieldValue;
	senderID: string;
}

export interface MonitorRequestNotif extends Notification {}
export interface RecordCommentNotif extends Notification {
	recordDocRef: string;
}
