import { useState, useEffect } from "react";

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height,
	};
}

export default function useIsSmartphone() {
	const [isSmartphone, setIsSmartphone] = useState(true);

	useEffect(() => {
		function handleResize() {
			setIsSmartphone(getWindowDimensions().width < 600);
		}
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return { isSmartphone };
}
