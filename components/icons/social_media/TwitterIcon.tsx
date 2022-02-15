import { useState } from "react";

interface Props {
	size?: number;
}
const hoveredColor = "#5DA9DD";

const TwitterIcon: React.FC<Props> = ({ size = 24 }) => {
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
				<rect id='twitter-icon-rect-1' width='24' height='24' x='0' y='0' />
				<mask id='twitter-icon-mask-2' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
					<rect width='24' height='24' x='0' y='0' fill='black' />
					<use fill='white' xlinkHref='#twitter-icon-rect-1' />
				</mask>
			</defs>
			<g>
				<use fill='none' xlinkHref='#twitter-icon-rect-1' />
				<g mask='url(#twitter-icon-mask-2)'>
					<path
						fill='none'
						stroke={hovered ? hoveredColor : "rgb(217,214,209)"}
						strokeDasharray='0 0 0 0'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M23 3c-.95761502.6754774-2.01789212 1.19210925-3.14 1.53-1.23364047-1.4184622-3.22163004-1.91588569-4.97791854-1.24554657C13.12579296 3.95479256 11.97480026 5.65030087 12 7.53v1C8.43066483 8.6225524 5.05202531 6.9219705 3 4 .94797469 1.0780295-1 13 8 17c-2.05947244 1.3979663-4.51284309 2.09892935-7 2 9 5 20 0 20-11.5-.00092089-.27854636-.0277025-.5564056-.08-.83C21.94060315 5.66349308 22.6608274 4.39271279 23 3h0z'
					/>
				</g>
			</g>
		</svg>
	);
};

export default TwitterIcon;
