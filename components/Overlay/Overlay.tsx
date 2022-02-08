import styles from "./Overlay.module.css";
interface OverlayProps {
	onClick: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ onClick }) => {
	return <div className={styles.container} onClick={onClick} />;
};

export default Overlay;
