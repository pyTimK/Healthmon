import { MouseEventHandler } from "react";
import Sizedbox from "../../Sizedbox";
import useMyModal from "../useMyModal";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
	title: string;
	description: string;
	onConfirm?: MouseEventHandler<HTMLButtonElement>;
}

const useConfirmModal = () => {
	const [MyModal, openConfirmModal, closeConfirmModal, isConfirmModalOpen] = useMyModal();

	const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, description, onConfirm }) => {
		console.log("confim modal rerendered");
		return (
			<MyModal>
				<div className={styles.section}>
					<h1 className={styles.title}>{title}</h1>
					<Sizedbox height={30} />

					<p>{description}</p>
					<div className={styles.buttonsWrapper}>
						<button className='transparent-button' onClick={closeConfirmModal}>
							No
						</button>
						<button className='pink-button' onClick={onConfirm}>
							Yes
						</button>
					</div>
				</div>
			</MyModal>
		);
	};

	return { ConfirmModal, openConfirmModal, closeConfirmModal, isConfirmModalOpen };
};

export default useConfirmModal;
