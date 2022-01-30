import styles from "./SettingsRow.module.css";

interface SettingsRowProps {
	title: string;
	subtitle?: string;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ title, subtitle, children }) => {
	return (
		<div className={styles.row}>
			<div className={styles.rowLeft}>
				<h3 className={styles.rowTitle}>{title}</h3>
				{subtitle && <p className={styles.rowSubTitle}>({subtitle})</p>}
			</div>
			<div className={styles.rowRight}>{children}</div>
		</div>
	);
};

export default SettingsRow;
