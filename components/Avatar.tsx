import clsx from "clsx";
import { MouseEventHandler, useEffect, useState } from "react";

interface Props {
	photoURL?: string;
	size?: number;
	letter?: string;
	className?: string;
	nonclickable?: boolean;
	onClick?: MouseEventHandler<HTMLDivElement>;
}

const Avatar: React.FC<Props> = ({ photoURL, size = 30, letter = "K", className, nonclickable = false, onClick }) => {
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
	const letterStyle = { fontSize: "1.2rem", margin: 0 } as React.CSSProperties;

	useEffect(() => {
		setHasValidPhotoURL(photoURL !== undefined && photoURL !== "");
	}, [photoURL]);

	return (
		<div style={circleStyle} className={className} onClick={onClick}>
			{hasValidPhotoURL ? (
				<img
					className={clsx("avatar", className, "unselectable")}
					src={photoURL}
					alt='avatar'
					width={size}
					height={size}
					onError={() => setHasValidPhotoURL(false)}
				/>
			) : (
				<div className={clsx("avatar", className, "unselectable")} style={letterStyle}>
					<p style={{ fontSize: `${size - 10}px`, margin: 0, textAlign: "center", fontWeight: "400" }}>
						{letter.charAt(0).toUpperCase()}
					</p>
				</div>
			)}
		</div>
	);
};

export default Avatar;
