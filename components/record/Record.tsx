import clsx from "clsx";
import firebase from "firebase/compat/app";
import { motion } from "framer-motion";
import React, {
	Dispatch,
	FocusEventHandler,
	ReactElement,
	SetStateAction,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Role } from "../../classes/MyUser";
import ButtonStatus from "../../enums/ButtonStatus";
import { getTimeFromDate } from "../../function/dateConversions";
import { pulseStatus, spo2Status, tempStatus } from "../../function/healthRanges";
import logError from "../../function/logError";
import notify from "../../function/notify";
import useRecordComments from "../../hooks/useRecordComments";
import { AppContext } from "../../pages/_app";
import HealthStatus from "../../types/HealthStatus";
import UserComment from "../../types/RecordComment";
import CommentBlock from "./comment/CommentBlock";
import styles from "./Record.module.css";
import { RecordBlockContext } from "./RecordsBlock";

export interface RecordData {
	temp: number;
	pulse: number;
	spo2: number;
	timestamp: firebase.firestore.Timestamp; //TODO Fix timestamp
}

export interface RecordMetaData {
	recordDate: string;
	recordTime: string;
	patientId: string;
}

export interface RecordProps {
	record: RecordData;
	index: number;
	showCommentButtons: boolean;
	setSelectedRecord: Dispatch<SetStateAction<number>>;
	recordMetaData: RecordMetaData;
}

export const RecordContext = React.createContext({
	editMode: false,
	setEditMode: (() => {}) as Dispatch<React.SetStateAction<boolean>>,
	userComment: undefined as UserComment | undefined,
});

const Record: React.FC<RecordProps> = ({ record, index, showCommentButtons, setSelectedRecord, recordMetaData }) => {
	const { user, userConfig, fireStoreHelper } = useContext(AppContext);
	const [justOpened, setJustOpened] = useState(true);

	const commentInputRef = useRef<HTMLTextAreaElement>(null);
	const [cancelButtonStatus, setCancelButtonStatus] = useState<ButtonStatus>(ButtonStatus.Hidden);
	const [commentButtonStatus, setCommentButtonStatus] = useState<ButtonStatus>(ButtonStatus.Hidden);

	const { userCommentsOnPatient } = useContext(RecordBlockContext);

	const userComment = userCommentsOnPatient.find(
		(_userComment) =>
			_userComment.recordTime === recordMetaData.recordTime &&
			_userComment.recordDate === recordMetaData.recordDate
	);

	const { recordComments } = useRecordComments(recordMetaData);

	const [editMode, setEditMode] = useState<boolean>(false);

	const canComment = userConfig.role === Role.HealthWorker && (!userComment || editMode);

	const onCommentInputFocus: FocusEventHandler<HTMLTextAreaElement> = (e) => {
		if (!canComment) return;

		setSelectedRecord(index);
		setCancelButtonStatus(ButtonStatus.Enabled);
		setCommentButtonStatus(
			commentInputRef.current && commentInputRef.current.value.length > 0
				? ButtonStatus.Enabled
				: ButtonStatus.Disabled
		);
	};

	useEffect(() => {
		setJustOpened(false);
	}, []);

	const cancelEdit = () => {
		if (!canComment) return;

		setEditMode(false);
		setCancelButtonStatus(ButtonStatus.Hidden);
		setCommentButtonStatus(ButtonStatus.Hidden);
		if (!commentInputRef.current) return;
		commentInputRef.current.value = "";
	};

	const updateCommentButtonStatus = () => {
		if (!canComment) return;

		setCommentButtonStatus(
			commentInputRef.current && commentInputRef.current.value.length > 0
				? ButtonStatus.Enabled
				: ButtonStatus.Disabled
		);
	};

	const submitComment = async () => {
		if (!canComment || !commentInputRef.current) return;
		if (!fireStoreHelper) return;

		const comment = commentInputRef.current.value;

		try {
			if (editMode) await fireStoreHelper.editComment(user, comment, recordMetaData);
			else await fireStoreHelper.addComment(user, comment, recordMetaData);
			setEditMode(false);
		} catch (_e) {
			logError(_e);
			notify(`Error ${editMode ? "editing" : "adding"} comment`);
		}
	};

	const now = new Date();

	return (
		<motion.div
			layout={!justOpened}
			initial={!justOpened && { height: 0 }}
			animate={{ height: "fit-content", overflow: "hidden" }}
			transition={{ duration: 3 }}>
			<RecordContext.Provider value={{ editMode, setEditMode, userComment }}>
				<div className={styles.container} id={recordMetaData.recordTime}>
					<div className={styles.left}>
						<div className={styles.leftTime}>{getTimeFromDate(record.timestamp.toDate())}</div>
						{console.log(record.timestamp.toDate())}
						{console.log(now.getTime() - (record.timestamp.toMillis() - 28800000))}
						{now.getTime() - (record.timestamp.toMillis() - 28800000) < 300000 && (
							<div className={styles.leftNew}>- RECENT -</div>
						)}
					</div>
					<div className={styles.right}>
						<div
							className={clsx(
								styles.data,
								!canComment && !recordComments.length && styles.dataRoundBorder
							)}>
							<Data
								measurement={record.temp.toFixed(1)}
								units=' °C'
								name='Temp'
								imgName='thermometer'
								status={tempStatus(record.temp)}
							/>
							<Data
								measurement={Math.floor(record.pulse).toString()}
								units='BPM'
								name='PR'
								imgName='heartbeat'
								status={pulseStatus(record.pulse)}
							/>
							<Data
								measurement={Math.floor(record.spo2).toString()}
								units='%'
								name={
									<>
										SpO<sub>2</sub>
									</>
								}
								imgName='blood'
								status={spo2Status(record.spo2)}
							/>
						</div>
						<CommentBlock
							commentInputRef={commentInputRef}
							onFocus={onCommentInputFocus}
							updateCommentButtonStatus={updateCommentButtonStatus}
							canComment={canComment}
							recordComments={recordComments}
						/>
					</div>
				</div>
				{canComment && (
					<CommentButtons
						showCommentButtons={showCommentButtons}
						cancelButtonStatus={cancelButtonStatus}
						commentButtonStatus={commentButtonStatus}
						onCancel={cancelEdit}
						onComment={submitComment}
					/>
				)}
			</RecordContext.Provider>
		</motion.div>
	);
};

interface CommentButtonsProps {
	showCommentButtons: boolean;
	cancelButtonStatus: ButtonStatus;
	commentButtonStatus: ButtonStatus;
	onCancel: () => void;
	onComment: () => void;
}

const CommentButtons: React.FC<CommentButtonsProps> = ({
	showCommentButtons,
	cancelButtonStatus,
	commentButtonStatus,
	onCancel,
	onComment,
}) => {
	return (
		<div className={styles.commentButtonsWrapper}>
			{showCommentButtons && (
				<div className={styles.commentButtons}>
					<button
						disabled={cancelButtonStatus === ButtonStatus.Disabled}
						className={clsx("transparent-button", cancelButtonStatus === ButtonStatus.Hidden && "hidden")}
						onClick={onCancel}>
						Cancel
					</button>
					<button
						onClick={onComment}
						disabled={commentButtonStatus === ButtonStatus.Disabled}
						className={clsx("pink-button", commentButtonStatus === ButtonStatus.Hidden && "hidden")}>
						Comment
					</button>
				</div>
			)}
		</div>
	);
};
interface DataProps {
	measurement: string;
	imgName: string;
	units: string | ReactElement;
	name: string | ReactElement;
	status?: HealthStatus;
}

const Data: React.FC<DataProps> = ({ measurement, units, name, imgName, status = HealthStatus.normal }) => {
	let colorStyle: string;
	switch (status) {
		case HealthStatus.belowNormal:
			colorStyle = styles.blue;
			break;

		case HealthStatus.aboveNormal:
			colorStyle = styles.orange;
			break;

		default:
			colorStyle = styles.normal;
			break;
	}

	return (
		<div className={styles.measurement}>
			<img src={`/img/svg/${imgName}.svg`} width={50} height={50} />
			<h2 className={clsx(styles.number, colorStyle)}>
				{measurement} {units}
			</h2>
			{/* <p>{name}</p> */}
		</div>
	);
};

export default Record;
