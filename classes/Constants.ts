export abstract class PageDescriptions {
	static readonly HOME =
		"Healthmon is a web application that is used together with the IoT-Based Health Monitoring Device. It monitors the collected health data of patients and stores the result in a cloud storage for later access.";
}

export const recordHeaderDescriptions = {
	present: {
		good: [
			" is feeling well today.",
			" is feeling good today.",
			" couldn’t be better today.",
			" is doing fine today.",
		],
		bad: [
			" is feeling under the weather today.",
			" is not feeling good today.",
			" is unwell today.",
			" is feeling low today.",
		],
	},

	past: {
		good: [
			" felt well on that day.",
			" felt good on that day.",
			" couldn’t be better on that day.",
			" felt fine on that day.",
		],
		bad: [
			" felt under the weather on that day.",
			" did not feel good on that day.",
			" was unwell on that day.",
			" was feeling low on that day.",
		],
	},
};
