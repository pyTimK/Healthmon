import { HealthWorker } from "./../classes/MyUser";
import { FieldValue } from "firebase/firestore";
export const enum NotifSubject {
	MonitorRequest = "monitor_request",
	RecordComment = "record_comment",
}

interface PatientNotif {
	timestamp: FieldValue;
	sender: HealthWorker;
}

export interface MonitorRequestNotif extends PatientNotif {}
export interface RecordCommentNotif extends PatientNotif {
	recordDate: string;
	recordTime: string;
}

export function isRecordCommentNotif(notif: MonitorRequestNotif | RecordCommentNotif): notif is RecordCommentNotif {
	return (<RecordCommentNotif>notif).recordDate !== undefined;
}
