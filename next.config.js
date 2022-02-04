/** @type {import('next').NextConfig} */

const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");
const optimizedImages = require("next-optimized-images");

const nextConfig = withPlugins([
	[
		optimizedImages,
		{
			/* config for next-optimized-images */
		},
	],

	withPWA({
		reactStrictMode: true,
		pwa: {
			dest: "public",
			register: true,
			skipWaiting: true,
			disable: process.env.NODE_ENV === "development",
		},
		experimental: {
			// Enables the styled-components SWC transform
			styledComponents: true,
		},
	}),
]);

// const nextConfig = withPWA({
//   reactStrictMode: true,
//   pwa: {
//     dest: "public",
//     register: true,
//     skipWaiting: true,
//     disable: process.env.NODE_ENV === "development",
//   },
// });

module.exports = nextConfig;
