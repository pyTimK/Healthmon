import { motion } from "framer-motion";
import styles from "./Overlay.module.css";
interface OverlayProps {
	onClick: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ onClick }) => {
	return (
		<motion.div
			key='overlay'
			animate={{ opacity: 0.5 }}
			initial={{ opacity: 0 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.1 }}
			className={styles.container}
			onClick={onClick}
		/>
	);
};

export default Overlay;
