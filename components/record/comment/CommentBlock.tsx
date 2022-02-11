import { FocusEventHandler, RefObject, useEffect, useState } from "react";
import { FireStoreHelper } from "../../../classes/FireStoreHelper";
import logError from "../../../function/logError";
import notify from "../../../function/notify";
import UserComment, { RecordComment } from "../../../types/RecordComment";
import styles from "./CommentBlock.module.css";
import MyComment from "./MyComment";

interface CommentBlockProps {
	commentInputRef: RefObject<HTMLTextAreaElement>;
	onFocus: FocusEventHandler<HTMLTextAreaElement>;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	userComment: UserComment;
}

const CommentBlock: React.FC<CommentBlockProps> = ({ commentInputRef, onFocus, onChange, userComment }) => {
	const [comments, setComments] = useState<RecordComment[]>([]);
	const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = "1px";
		e.target.style.height = e.target.scrollHeight + "px";
		onChange(e);
	};

	const commentsListener = () => {
		try {
			const unsub = FireStoreHelper.commentsListener(userComment, setComments);
			if (unsub) return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not get comments online");
		}
	};

	useEffect(() => {
		return commentsListener();
	}, [userComment]);

	return (
		<div className={styles.container}>
			{/* <Avatar photoURL={user.photoURL} letter={user.name} /> */}
			<div className={styles.comments}>
				{comments.map((comment, i) => (
					<MyComment key={i} comment={comment} />
				))}
			</div>
			<textarea
				rows={1}
				className={styles.textarea}
				ref={commentInputRef}
				placeholder='Add comment...'
				onChange={handleOnChange}
				onFocus={onFocus}
			/>
		</div>
	);
};

export default CommentBlock;
