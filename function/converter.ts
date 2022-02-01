import HealthWorker from "../types/HealthWorker";

export const formatHealthWorkers = (healthWorkers: HealthWorker[]) => {
	const formattedHealthWorkers = <{ [key: string]: HealthWorker }>{};

	for (const healthWorker of healthWorkers) {
		formattedHealthWorkers[healthWorker.id] = healthWorker;
	}

	return formattedHealthWorkers;
};
