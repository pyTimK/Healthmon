import { CirclePlusFill, CircleXFill } from "akar-icons";
import styles from "./AddOption.module.css";

interface AddOptionProps {
	isAdd: boolean;
	addCallback: () => void;
	removeCallback: () => void;
}

const AddOption: React.FC<AddOptionProps> = ({ isAdd, addCallback, removeCallback }) => {
	return (
		<div className={styles.addOption}>
			{isAdd ? (
				<CirclePlusFill size={24} color='var(--pink)' cursor='pointer' onClick={addCallback} />
			) : (
				<CircleXFill size={24} color='var(--red)' cursor='pointer' onClick={removeCallback} />
			)}
		</div>
	);
};

export default AddOption;
