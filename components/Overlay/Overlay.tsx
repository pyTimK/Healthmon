import { motion } from "framer-motion";
import styles from "./Overlay.module.css";
interface OverlayProps {
	opacity?: number;
	onClick: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ onClick, opacity = 0.5 }) => {
	return (
		<motion.div
			key='overlay'
			animate={{ opacity: opacity }}
			initial={{ opacity: 0 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.1 }}
			className={styles.container}
			onClick={onClick}
		/>
	);
};

export default Overlay;
