import { useState } from "react";

interface Props {
	size?: number;
}

const hoveredColor = "#D51A45";

const InstagramIcon: React.FC<Props> = ({ size = 24 }) => {
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
				<rect id='instagram-icon-rect-1' width='24' height='24' x='0' y='0' />
				<mask id='instagram-icon-mask-2' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
					<rect width='24' height='24' x='0' y='0' fill='black' />
					<use fill='white' xlinkHref='#instagram-icon-rect-1' />
				</mask>
			</defs>
			<g>
				<use fill='none' xlinkHref='#instagram-icon-rect-1' />
				<g mask='url(#instagram-icon-mask-2)'>
					<path
						fill='none'
						stroke={hovered ? hoveredColor : "rgb(217,214,209)"}
						strokeDasharray='0 0 0 0'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M7 2h10c2.75957512 0 5 2.24042488 5 5v10c0 2.75957512-2.24042488 5-5 5H7c-2.75957512 0-5-2.24042488-5-5V7c0-2.75957512 2.24042488-5 5-5z'
					/>
					<path
						fill='none'
						stroke={hovered ? hoveredColor : "rgb(217,214,209)"}
						strokeDasharray='0 0 0 0'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M16 11.37c.25312244 1.7069716-.61697416 3.38384452-2.15837347 4.15967384-1.54139932.77582933-3.40657796.47569682-4.62678757-.7445128-1.22020962-1.2202096-1.52034213-3.08538825-.7445128-4.62678757C9.24615548 8.61697416 10.9230284 7.74687757 12.63 8c1.74297677.25846155 3.11153845 1.62702323 3.37 3.37h0z'
					/>
					<path
						fill='none'
						stroke={hovered ? hoveredColor : "rgb(217,214,209)"}
						strokeDasharray='0 0 0 0'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M17.5 6.5h.01'
					/>
				</g>
			</g>
		</svg>
	);
};

export default InstagramIcon;
