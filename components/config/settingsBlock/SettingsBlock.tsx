import clsx from "clsx";
import { MouseEventHandler } from "react";
import Sizedbox from "../../Sizedbox";
import styles from "./SettingsBlock.module.css";

interface SettingsBlockProps {
	hint: string;
	hasOptionButton?: boolean;
	onOptionButtonClick?: MouseEventHandler<HTMLButtonElement>;
	optionButtonName?: string;
	editing?: boolean;
}

const SettingsBlock: React.FC<SettingsBlockProps> = ({
	hint,
	children,
	hasOptionButton = false,
	onOptionButtonClick,
	editing = false,
	optionButtonName = "Edit",
}) => {
	return (
		<div className={styles.container}>
			<Sizedbox height={40} />
			<div className={styles.header}>
				<h5 className={styles.title}>{hint}</h5>
				{hasOptionButton && (
					<div className={clsx(styles.option, editing && "hidden")}>
						<button className='green-button' onClick={onOptionButtonClick}>
							{optionButtonName}
						</button>
					</div>
				)}
			</div>
			{children}
		</div>
	);
};

export default SettingsBlock;
