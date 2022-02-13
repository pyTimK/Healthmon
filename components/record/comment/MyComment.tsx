import { Pencil } from "akar-icons";
import { useContext } from "react";
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
	const { user } = useContext(HomeContext);
	const { editMode } = useContext(RecordContext);
	const isHidden = editMode && comment.sender.id === user.id;

	const handleOnEdit = () => {
		if (!onEdit) return;
		onEdit(comment);
	};
	if (isHidden) return <></>;
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Avatar photoURL={comment.sender.photoURL} letter={comment.sender.name} />
				<div className={styles.name}>{comment.sender.name}</div>

				<div className={styles.time}>
					<div className={styles.dot} />
					6m ago
				</div>
				<div className={styles.pencilWrapper}>
					{canEdit && !editMode && (
						<div className={styles.pencil}>
							<Pencil strokeWidth={1} size={20} cursor='pointer' onClick={handleOnEdit} />
						</div>
					)}
				</div>
			</div>
			<div className={styles.commentText}>{comment.comment}</div>
		</div>
	);
};

export default MyComment;
