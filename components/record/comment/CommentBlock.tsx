import { FocusEventHandler, RefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
import { HomeContext } from "../../../pages/index";
import { RecordComment } from "../../../types/RecordComment";
import Divider from "../../Divider";
import { RecordContext } from "../Record";
import styles from "./CommentBlock.module.css";
import MyComment from "./MyComment";

interface CommentBlockProps {
	commentInputRef: RefObject<HTMLTextAreaElement>;
	onFocus: FocusEventHandler<HTMLTextAreaElement>;
	updateCommentButtonStatus: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	canComment: boolean;
	recordComments: RecordComment[];
}

const CommentBlock: React.FC<CommentBlockProps> = ({
	commentInputRef,
	onFocus,
	updateCommentButtonStatus,
	canComment,
	recordComments,
}) => {
	const { user } = useContext(HomeContext);
	const { editMode, setEditMode } = useContext(RecordContext);
	const textAreaDefaultValue = useRef<string>("");

	const updateHeight = useCallback(() => {
		const textArea = commentInputRef.current;
		if (!textArea) return;

		textArea.style.height = "1px";
		textArea.style.height = `${textArea.scrollHeight}px`;
	}, []);

	const handleOnChangeCommentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		updateHeight();
		updateCommentButtonStatus(e);
	};

	const onEdit = (comment: RecordComment) => {
		textAreaDefaultValue.current = comment.comment;
		setEditMode(true);
	};

	return (
		<div className={styles.container}>
			<div className={styles.comments}>
				{recordComments.map((comment, i) => (
					<div key={i}>
						{i !== 0 && <Divider margin={15} opacity={0.2} />}
						<MyComment comment={comment} canEdit={user.id === comment.sender.id} onEdit={onEdit} />
					</div>
				))}
			</div>
			{(canComment || editMode) && (
				<CommentTextArea
					defaultValue={textAreaDefaultValue.current}
					commentInputRef={commentInputRef}
					onChange={handleOnChangeCommentInput}
					onFocus={onFocus}
					updateHeight={updateHeight}
				/>
			)}
		</div>
	);
};

interface CommentTextAreaProps {
	defaultValue: string;
	commentInputRef: RefObject<HTMLTextAreaElement>;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onFocus: FocusEventHandler<HTMLTextAreaElement>;
	updateHeight: () => void;
}

const CommentTextArea: React.FC<CommentTextAreaProps> = ({
	defaultValue,
	commentInputRef,
	onChange,
	onFocus,
	updateHeight,
}) => {
	const { editMode } = useContext(RecordContext);
	const focusOnEnd = useCallback(() => {
		if (!commentInputRef.current) return;
		commentInputRef.current.focus();
		commentInputRef.current.value = "";
		commentInputRef.current.value = defaultValue;
	}, [commentInputRef, defaultValue]);

	useEffect(() => {
		if (editMode) {
			focusOnEnd();
			updateHeight();
		}
	}, [editMode, focusOnEnd]);

	return (
		<textarea
			rows={1}
			defaultValue={defaultValue}
			className={styles.textarea}
			ref={commentInputRef}
			placeholder='Add comment...'
			onChange={onChange}
			onFocus={onFocus}
		/>
	);
};

export default CommentBlock;
