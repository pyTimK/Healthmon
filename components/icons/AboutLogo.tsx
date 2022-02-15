interface Props {
	selected?: boolean;
	size?: number;
}

const AboutLogo: React.FC<Props> = ({ selected = false, size = 24 }) => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 372.95 335.506'>
			<g>
				<path
					fill='none'
					stroke={selected ? "rgb(236, 111, 126)" : "rgb(245,245,245)"}
					strokeDasharray='0 0 0 0'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='18.985'
					d='M336.4235 184.0605c19.993-19.992 30.034-46.213 30.034-72.393 0-26.222-10.041-52.445-30.034-72.436-17.062-17.08-38.65-26.873-60.907-29.376-29.9-3.363-60.994 6.43-83.919 29.376l-.123.122-.126-.122c-19.992-19.993-46.214-30.034-72.394-30.034-26.221 0-52.44 10.041-72.432 30.034-40.03 39.987-40.03 104.842 0 144.83l144.952 144.952 144.95-144.953h-.001z'
				/>
				<path
					fill='none'
					stroke={selected ? "rgb(236, 111, 126)" : "rgb(245,245,245)"}
					strokeDasharray='0 0 0 0'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='16.039'
					d='M154.9155 45.0785c-11.103-5.62-22.361-9.45-31.379-9.45-20.453 0-40.906 7.831-56.5 23.425-11.176 11.163-18.35 24.813-21.526 39.168'
				/>
			</g>
		</svg>
	);
};

export default AboutLogo;
