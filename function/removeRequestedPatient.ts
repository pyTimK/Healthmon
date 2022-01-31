import MyUser from "../classes/MyUser";
import Patient from "../types/Patient";

const removeRequestedPatient = (patient: Patient, user: MyUser) =>
	user.requestedUsers.filter((reqUser) => reqUser.id !== patient.id);

export default removeRequestedPatient;
