import { useState } from "react";

interface Props {
	size?: number;
}
const hoveredColor = "var(--calm-red)";

const MailIcon: React.FC<Props> = ({ size = 24 }) => {
	const [hovered, setHovered] = useState(false);
	const onMouseEnter = () => setHovered(true);
	const onMouseLeave = () => setHovered(false);
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			xmlnsXlink='http://www.w3.org/1999/xlink'
			width={size}
			height={size}
			style={{ cursor: hovered ? "pointer" : "default" }}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			viewBox='0 0 24 24'>
			<defs>
				<rect id='mail-icon-rect-1' width='24' height='24' x='0' y='0' />
				<mask id='mask-2' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
					<rect width='24' height='24' x='0' y='0' fill='black' />
					<use fill='white' xlinkHref='#mail-icon-rect-1' />
				</mask>
			</defs>
			<g>
				<use fill='none' xlinkHref='#mail-icon-rect-1' />
				<g mask='url(#mask-2)'>
					<path
						fill='none'
						stroke={hovered ? hoveredColor : "rgb(217,214,209)"}
						strokeDasharray='0 0 0 0'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h0z'
					/>
					<path
						fill='none'
						stroke={hovered ? hoveredColor : "rgb(217,214,209)"}
						strokeDasharray='0 0 0 0'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M22 6l-10 7L2 6'
					/>
				</g>
			</g>
		</svg>
	);
};

export default MailIcon;
