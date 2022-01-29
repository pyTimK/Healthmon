const logError = (_e: any) => {
	const e = _e as Error;
	console.error(e);
};

export default logError;
