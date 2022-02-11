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
			" felt well on this day.",
			" felt good on this day.",
			" couldn’t be better on this day.",
			" felt fine on this day.",
		],
		bad: [
			" felt under the weather on this day.",
			" did not feel good on this day.",
			" was unwell on this day.",
			" was feeling low on this day.",
		],
	},
};
