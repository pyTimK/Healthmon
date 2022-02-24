import clsx from "clsx";
import { MouseEventHandler, useEffect, useState } from "react";
import Avatar from "react-avatar";
import useDevice, { DeviceType } from "../hooks/useIsSmartphone";

interface Props {
	photoURL?: string;
	size?: number;
	letter?: string;
	className?: string;
	nonclickable?: boolean;
	onClick?: MouseEventHandler<HTMLDivElement>;
	onFrontAbsolute?: boolean;
}

const MyAvatar: React.FC<Props> = ({
	photoURL,
	size = 30,
	letter = "K",
	className,
	nonclickable = false,
	onClick,
	onFrontAbsolute = false,
}) => {
	const circleStyle = {
		height: size,
		width: size,
		background: "transparent",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: "#28272C",
		fontSize: 40,
		fontWeight: "bolder",
		borderRadius: Math.floor(size / 2),
		cursor: nonclickable ? "default" : "pointer",
	} as React.CSSProperties;
	const [hasValidPhotoURL, setHasValidPhotoURL] = useState<boolean>(photoURL !== undefined && photoURL !== "");
	const { device } = useDevice();
	const letterWrapperStyle = {
		backgroundColor: "var(--blue)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	} as React.CSSProperties;

	useEffect(() => {
		setHasValidPhotoURL(photoURL !== undefined && photoURL !== "");
	}, [photoURL]);

	return (
		<div style={circleStyle} className={clsx(className, onFrontAbsolute && "onFrontAbsolute")} onClick={onClick}>
			{hasValidPhotoURL ? (
				<img
					className={clsx("avatar", className, "unselectable")}
					src={photoURL}
					alt='avatar'
					width={size}
					draggable={false}
					height={size}
					onError={() => setHasValidPhotoURL(false)}
				/>
			) : (
				// <div className={clsx("avatar", className, "unselectable")} style={letterWrapperStyle}>
				// 	<p
				// 		style={{
				// 			fontSize: `${device === DeviceType.Smartphone ? 1.8 : 3}rem`,
				// 			margin: 0,
				// 			textAlign: "center",
				// 			fontWeight: "800",
				// 			color: "var(--green)",
				// 		}}>
				// 		{letter.charAt(0).toUpperCase()}
				// 	</p>
				// </div>

				<Avatar name={letter.charAt(0).toUpperCase()} round={true} size={`100%`} />
			)}
		</div>
	);
};

export default MyAvatar;
