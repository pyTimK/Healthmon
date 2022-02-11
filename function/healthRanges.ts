import HealthStatus from "../types/HealthStatus";

export const tempStatus = (temp: number) => {
	if (temp < 36.1) return HealthStatus.belowNormal;
	if (temp > 37.2) return HealthStatus.aboveNormal;
	return HealthStatus.normal;
};

export const pulseStatus = (pulse: number) => {
	if (pulse < 60) return HealthStatus.belowNormal;
	if (pulse > 100) return HealthStatus.aboveNormal;
	return HealthStatus.normal;
};

export const spo2Status = (spo2: number) => {
	if (spo2 < 95) return HealthStatus.belowNormal;
	return HealthStatus.normal;
};
