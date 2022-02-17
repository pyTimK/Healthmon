import { useState, useEffect } from "react";

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height,
	};
}

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(
		typeof window !== "undefined"
			? getWindowDimensions()
			: {
					width: 0,
					height: 0,
			  }
	);
	const isSmartphone = windowDimensions.width < 600;

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return { ...windowDimensions, isSmartphone };
}
