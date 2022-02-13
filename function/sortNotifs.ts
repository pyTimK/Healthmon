import { MonitorRequestNotif, RecordCommentNotif } from "../types/Notification";
import firebase from "firebase/compat/app";

const sortNotifs = (monitorRequestNotifs: MonitorRequestNotif[], recordCommentNotifs: RecordCommentNotif[]) =>
	([...monitorRequestNotifs, ...recordCommentNotifs] as (MonitorRequestNotif | RecordCommentNotif)[]).sort(function (
		a,
		b
	) {
		return (
			(b.timestamp as firebase.firestore.Timestamp).seconds -
			(a.timestamp as firebase.firestore.Timestamp).seconds
		);
	});

export default sortNotifs;
