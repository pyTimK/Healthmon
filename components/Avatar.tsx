import clsx from "clsx";
import { MouseEventHandler } from "react";

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
		background: "#E4D9CF",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: "#28272C",
		fontSize: 40,
		fontWeight: "bolder",
		borderRadius: Math.floor(size / 2),
		cursor: nonclickable ? "default" : "pointer",
	} as React.CSSProperties;

	const letterStyle = { fontSize: "1.2rem", margin: 0 } as React.CSSProperties;

	return (
		<div style={circleStyle} className={className} onClick={onClick}>
			{photoURL ? (
				<img className={clsx("avatar", className)} src={photoURL} alt='avatar' width={size} height={size} />
			) : (
				<p style={letterStyle}>{letter.charAt(0).toUpperCase()}</p>
			)}
		</div>
	);
};

export default Avatar;
