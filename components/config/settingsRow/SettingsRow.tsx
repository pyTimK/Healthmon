import MyAvatar from "../../Avatar";
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
				{photoURL && <MyAvatar photoURL={photoURL} letter={title} nonclickable />}
				<div className={styles.titleWrapper}>
					<h3 className={styles.rowTitle}>{title}</h3>
					{subtitle && <p className={styles.rowSubTitle}>{subtitle}</p>}
				</div>
			</div>
			<div className={styles.rowRight}>{children}</div>
		</div>
	);
};

export default SettingsRow;
