import MyUser from "../classes/MyUser";
import Patient from "../types/Patient";

const alreadyPatient = (patient: Patient, user: MyUser) =>
	user.monitoring.some((monitoringPatient) => monitoringPatient.id === patient.id);

export default alreadyPatient;
