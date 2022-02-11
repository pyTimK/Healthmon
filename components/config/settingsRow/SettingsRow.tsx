import Avatar from "../../Avatar";
import styles from "./SettingsRow.module.css";

interface SettingsRowProps {
	title: string;
	subtitle?: string;
	photoURL?: string;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ title, subtitle, photoURL, children }) => {
	return (
		<div className={styles.row}>
			<div className={styles.rowLeft}>
				{photoURL && <Avatar photoURL={photoURL} letter={title} nonclickable />}
				<h3 className={styles.rowTitle}>{title}</h3>
				{subtitle && <p className={styles.rowSubTitle}>({subtitle})</p>}
			</div>
			<div className={styles.rowRight}>{children}</div>
		</div>
	);
};

export default SettingsRow;
