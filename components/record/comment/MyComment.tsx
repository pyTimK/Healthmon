import { Pencil, TrashCan } from "akar-icons";
import firebase from "firebase/compat/app";
import { useContext } from "react";
import { FireStoreHelper } from "../../../classes/FireStoreHelper";
import { Role } from "../../../classes/MyUser";
import { getCommentAge } from "../../../function/dateConversions";
import logError from "../../../function/logError";
import notify from "../../../function/notify";
import { HomeContext } from "../../../pages/home";
import { RecordComment } from "../../../types/RecordComment";
import Avatar from "../../Avatar";
import { RecordContext } from "../Record";
import styles from "./MyComment.module.css";

interface MyCommentProps {
	comment: RecordComment;
	canEdit?: boolean;
	onEdit?: (comment: RecordComment) => void;
}

const MyComment: React.FC<MyCommentProps> = ({ comment, canEdit = false, onEdit }) => {
	const { user, userConfig } = useContext(HomeContext);
	const { editMode, userComment } = useContext(RecordContext);
	const isMine = userConfig.role === Role.HealthWorker && comment.sender.id === user.id;
	const isHidden = editMode && isMine;

	const handleOnEdit = () => {
		if (!onEdit) return;
		onEdit(comment);
	};

	const deleteComment = async () => {
		if (!isMine) return;

		try {
			//TODO CONTINUE
			// await FireStoreHelper.
			// const db = firebase.firestore();
			// const recordRef = db.collection("records").doc(comment.recordId);
			// const commentRef = recordRef.collection("comments").doc(comment.id);
			// await commentRef.delete();
		} catch (_e) {
			logError(_e);
			notify("Error deleting comment");
		}
	};

	if (isHidden) return <></>;
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Avatar photoURL={comment.sender.photoURL} letter={comment.sender.name} />
				<div className={styles.name}>{comment.sender.name}</div>

				<div className={styles.time}>
					<div className={styles.dot} />
					{getCommentAge(comment.timestamp as firebase.firestore.Timestamp)}
				</div>
				{canEdit && !editMode && (
					<div className={styles.pencilTrashWrapper}>
						<div className={styles.trash}>
							<TrashCan strokeWidth={1} size={20} cursor='pointer' onClick={deleteComment} />
						</div>
						<div className={styles.pencil}>
							<Pencil strokeWidth={1} size={20} cursor='pointer' onClick={handleOnEdit} />
						</div>
					</div>
				)}
			</div>
			{/* {isMine && userComment && <>{userComment.hasNotif ? "hasNotif" : "no notifs"}</>} */}
			<div className={styles.commentText}>{comment.comment}</div>
		</div>
	);
};

export default MyComment;