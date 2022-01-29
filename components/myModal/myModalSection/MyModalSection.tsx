import { MouseEventHandler } from "react";
import styles from "./MyModalSectionProps.module.css";
import clsx from "clsx";

interface MyModalSectionProps {
	onClick?: MouseEventHandler<HTMLDivElement>;
	description?: string;
	highlightOnHover?: boolean;
	isBox?: boolean;
}

const MyModalSection: React.FC<MyModalSectionProps> = ({
	onClick,
	description,
	highlightOnHover = false,
	isBox = false,
	children,
}) => {
	return (
		<div
			className={clsx(styles.container, highlightOnHover && styles.highlightOnHover, isBox && styles.isBox)}
			onClick={onClick}>
			{children}
			{description && <p className={styles.modalTxt}>{description}</p>}
		</div>
	);
};

export default MyModalSection;
