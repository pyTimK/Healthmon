import clsx from "clsx";
import firebase from "firebase/compat/app";
import { serverTimestamp } from "firebase/firestore";
import {
	Dispatch,
	FocusEventHandler,
	ReactElement,
	SetStateAction,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import { FireStoreHelper } from "../../classes/FireStoreHelper";
import ButtonStatus from "../../enums/ButtonStatus";
import { getHHMMSS } from "../../function/dateConversions";
import { pulseStatus, spo2Status, tempStatus } from "../../function/healthRanges";
import logError from "../../function/logError";
import notify from "../../function/notify";
import { UserContext } from "../../pages/home";
import HealthStatus from "../../types/HealthStatus";
import UserComment from "../../types/RecordComment";
import CommentBlock from "./comment/CommentBlock";
import styles from "./Record.module.css";

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

export interface Props {
	temp: number;
	pulse: number;
	spo2: number;
	timestamp: firebase.firestore.Timestamp;
	index: number;
	showCommentButtons: boolean;
	setSelectedRecord: Dispatch<SetStateAction<number>>;
	recordMetaData: RecordMetaData;
}

const Record: React.FC<Props> = ({
	temp,
	pulse,
	spo2,
	timestamp,
	index,
	showCommentButtons,
	setSelectedRecord,
	recordMetaData,
}) => {
	const user = useContext(UserContext);
	const commentInputRef = useRef<HTMLTextAreaElement>(null);
	const [cancelButtonStatus, setCancelButtonStatus] = useState<ButtonStatus>(ButtonStatus.Hidden);
	const [commentButtonStatus, setCommentButtonStatus] = useState<ButtonStatus>(ButtonStatus.Hidden);

	const userComment: UserComment = useMemo(() => {
		return {
			recordDate: recordMetaData.recordDate,
			recordTime: recordMetaData.recordTime,
			patientId: recordMetaData.patientId,
			hasNotif: true,
			timestamp: serverTimestamp(),
		};
	}, [recordMetaData]);

	const onCommentInputFocus: FocusEventHandler<HTMLTextAreaElement> = (e) => {
		setSelectedRecord(index);
		setCancelButtonStatus(ButtonStatus.Enabled);
		setCommentButtonStatus(
			commentInputRef.current && commentInputRef.current.value.length > 0
				? ButtonStatus.Enabled
				: ButtonStatus.Disabled
		);
	};

	const cancelEdit = () => {
		setCancelButtonStatus(ButtonStatus.Hidden);
		setCommentButtonStatus(ButtonStatus.Hidden);
		if (!commentInputRef.current) return;
		commentInputRef.current.value = "";
	};

	const onCommentChange = () => {
		setCommentButtonStatus(
			commentInputRef.current && commentInputRef.current.value.length > 0
				? ButtonStatus.Enabled
				: ButtonStatus.Disabled
		);
	};

	const submitComment = async () => {
		if (!commentInputRef.current) return;

		const comment = commentInputRef.current.value;

		try {
			await FireStoreHelper.addComment(user, comment, userComment);
		} catch (_e) {
			logError(_e);
			notify("Error adding comment");
		}
	};

	return (
		<div>
			<div className={styles.container}>
				<div className={styles.left}>{getHHMMSS(timestamp.toDate())}</div>
				<div className={styles.right}>
					<div className={styles.data}>
						<Data
							measurement={temp.toFixed(1)}
							units=' °C'
							name='Temp'
							imgName='thermometer'
							status={tempStatus(temp)}
						/>
						<Data
							measurement={Math.floor(pulse).toString()}
							units='BPM'
							name='PR'
							imgName='heartbeat'
							status={pulseStatus(pulse)}
						/>
						<Data
							measurement={Math.floor(spo2).toString()}
							units='%'
							name={
								<>
									SpO<sub>2</sub>
								</>
							}
							imgName='blood'
							status={spo2Status(spo2)}
						/>
					</div>
					<CommentBlock
						commentInputRef={commentInputRef}
						onFocus={onCommentInputFocus}
						onChange={onCommentChange}
						userComment={userComment}
					/>
				</div>
			</div>
			<div className={styles.commentButtonsWrapper}>
				{showCommentButtons && (
					<div className={styles.commentButtons}>
						<button
							disabled={cancelButtonStatus === ButtonStatus.Disabled}
							className={clsx(
								"transparent-button",
								cancelButtonStatus === ButtonStatus.Hidden && "hidden"
							)}
							onClick={cancelEdit}>
							Cancel
						</button>
						<button
							onClick={submitComment}
							disabled={commentButtonStatus === ButtonStatus.Disabled}
							className={clsx("pink-button", commentButtonStatus === ButtonStatus.Hidden && "hidden")}>
							Comment
						</button>
					</div>
				)}
			</div>
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
