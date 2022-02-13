import { NextPage } from "next";

interface Props {
	margin?: number;
	opacity?: number;
}

const Divider: NextPage<Props> = ({ margin = 8, opacity = 0.5 }) => {
	const style = {
		height: "1px",
		background: "gray",
		opacity: opacity,
		margin: `0 ${margin}px`,
	} as React.CSSProperties;

	return <div style={style} />;
};

export default Divider;
