import { RecordComment } from "../../../types/RecordComment";
import Avatar from "../../Avatar";
import styles from "./MyComment.module.css";

interface MyCommentProps {
	comment: RecordComment;
}

const MyComment: React.FC<MyCommentProps> = ({ comment }) => {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Avatar photoURL={comment.sender.photoURL} letter={comment.sender.name} />
				<div className={styles.headerName}>{comment.sender.name}</div>
				<div className={styles.headerTime}></div>
			</div>
			<div className={styles.commentText}>{comment.comment}</div>
		</div>
	);
};

export default MyComment;
