import React, { CSSProperties, useContext } from "react";
import { Blob } from "react-blob";
import { DeviceType } from "../../hooks/useIsSmartphone";
import { AppContext } from "../../pages/_app";
import styles from "./BackgroundBlob.module.css";

interface BackgroundBlobProps {
	style?: CSSProperties;
	avatarSize: number;
}

const BackgroundBlob: React.FC<BackgroundBlobProps> = ({ style, avatarSize }) => {
	const { device } = useContext(AppContext);
	const isSmartphone = device === DeviceType.Smartphone;
	const smallBlobAvatarSize = isSmartphone ? 100 : 180;
	const largeBlobAvatarSize = isSmartphone ? 115 : 200;
	const smallOffset = Math.floor((smallBlobAvatarSize - avatarSize) / 2);
	const largeOffset = Math.floor((largeBlobAvatarSize - avatarSize) / 2);

	return (
		<div className={styles.container}>
			{typeof window !== "undefined" && (
				<div className={styles.wrapper}>
					<Blob
						size={`${smallBlobAvatarSize}px`}
						style={{
							position: "absolute",
							top: `-${smallOffset}px`,
							left: `-${smallOffset}px`,
							// transform: "translate(-50%, -50%)",
							// left: 0,
							backgroundColor: "var(--pink)",
							color: "white",
							opacity: 0.5,
							// fontSize: "50vh",
							...style,
						}}
					/>
					<Blob
						size={`${largeBlobAvatarSize}px`}
						style={{
							position: "absolute",
							top: `-${largeOffset}px`,
							left: `-${largeOffset}px`,
							// transform: "translate(-50%, -50%)",
							// left: 0,
							backgroundColor: "var(--pink)",
							color: "white",
							opacity: 0.3,
							// fontSize: "50vh",
							...style,
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default React.memo(BackgroundBlob);
