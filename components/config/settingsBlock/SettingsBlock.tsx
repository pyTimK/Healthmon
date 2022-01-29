import Sizedbox from "../../Sizedbox";
import styles from "./SettingsBlock.module.css";

interface SettingsBlockProps {
	hint: string;
}

const SettingsBlock: React.FC<SettingsBlockProps> = ({ hint, children }) => {
	return (
		<div className={styles.block}>
			<Sizedbox height={40} />
			<h5 className={styles.blockHint}>{hint}</h5>
			{children}
		</div>
	);
};

export default SettingsBlock;
