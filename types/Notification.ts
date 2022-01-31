import { FieldValue } from "firebase/firestore";
import HealthWorker from "./HealthWorker";
export const enum NotifSubject {
	MonitorRequest = "monitor_request",
	RecordComment = "record_comment",
}

interface Notification {
	timestamp: FieldValue;
	sender: HealthWorker;
}

export interface MonitorRequestNotif extends Notification {}
export interface RecordCommentNotif extends Notification {
	recordDocRef: string;
}
