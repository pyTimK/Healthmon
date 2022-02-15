import { useState } from "react";

interface Props {
	size?: number;
}
const hoveredColor = "#609DEE";

const FacebookIcon: React.FC<Props> = ({ size = 24 }) => {
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
				<rect id='fb-icon-rect-1' width='24' height='24' x='0' y='0' />
				<mask id='fb-icon-mask-2' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
					<rect width='24' height='24' x='0' y='0' fill='black' />
					<use fill='white' xlinkHref='#fb-icon-rect-1' />
				</mask>
			</defs>
			<g>
				<use fill='none' xlinkHref='#fb-icon-rect-1' />
				<g mask='url(#fb-icon-mask-2)'>
					<path
						fill='none'
						stroke={hovered ? hoveredColor : "rgb(217,214,209)"}
						strokeDasharray='0 0 0 0'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M18 2h-3c-2.76142375 0-5 2.23857625-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7c0-.55228475.44771525-1 1-1h3V2z'></path>
				</g>
			</g>
		</svg>
	);
};

export default FacebookIcon;
