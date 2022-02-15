import { useState } from "react";

interface Props {
	size?: number;
}

const hoveredColor = "#098ED6";

const LinkedInIcon: React.FC<Props> = ({ size = 24 }) => {
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
				<rect id='linkedin-icon-rect-1' width='24' height='24' x='0' y='0' />
				<mask id='linkedin-icon-mask-2' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
					<rect width='24' height='24' x='0' y='0' fill='black' />
					<use fill='white' xlinkHref='#linkedin-icon-rect-1' />
				</mask>
			</defs>
			<g>
				<use fill='none' xlinkHref='#linkedin-icon-rect-1' />
				<g mask='url(#linkedin-icon-mask-2)'>
					<path
						fill='none'
						stroke={hovered ? hoveredColor : "rgb(217,214,209)"}
						strokeDasharray='0 0 0 0'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M16 8c3.3137085 0 6 2.6862915 6 6v7h-4v-7c0-1.1045695-.8954305-2-2-2s-2 .8954305-2 2v7h-4v-7c0-3.3137085 2.6862915-6 6-6h0z'
					/>
					<rect
						width='4'
						height='12'
						x='2'
						y='9'
						fill='none'
						stroke={hovered ? hoveredColor : "rgb(217,214,209)"}
						strokeDasharray='0 0 0 0'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						rx='0'
						ry='0'
					/>
					<ellipse
						cx='4'
						cy='4'
						fill='none'
						stroke={hovered ? hoveredColor : "rgb(217,214,209)"}
						strokeDasharray='0 0 0 0'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						rx='2'
						ry='2'
					/>
				</g>
			</g>
		</svg>
	);
};

export default LinkedInIcon;
