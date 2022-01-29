import clsx from "clsx";
import { useModal } from "react-hooks-use-modal";
import styles from "./MyModal.module.css";

type UseMyModal = () => [React.FC<MyModalProps>, () => void, () => void, boolean];

interface MyModalProps {
	flexColumn?: boolean;
}

const useMyModal: UseMyModal = () => {
	const [Modal, openModal, closeModal, isModalOpen] = useModal("__next", { preventScroll: true });
	const MyModal: React.FC<MyModalProps> = ({ children, flexColumn = false }) => (
		<Modal>
			<div className={clsx(styles.container, flexColumn && styles.flexColumn)}>{children}</div>
		</Modal>
	);
	return [MyModal, openModal, closeModal, isModalOpen];
};

export default useMyModal;
