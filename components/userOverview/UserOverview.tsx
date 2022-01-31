import Avatar from "../Avatar";
import styles from "./UseOverview.module.css";
interface UserOverviewProps {
	name: string;
	number: string;
	photoURL?: string;
}

const UserOverview: React.FC<UserOverviewProps> = ({ name, number, photoURL }) => {
	return (
		<div className={styles.container}>
			<div>
				<Avatar size={48} photoURL={photoURL} letter={name} nonclickable />
			</div>
			<div className={styles.right}>
				<h3 className={styles.name}>{name}</h3>
				<h5 className={styles.number}>{number}</h5>
			</div>
		</div>
	);
};

export default UserOverview;
