import MyUser from "../classes/MyUser";
import Patient from "../types/Patient";

const alreadyRequested = (patient: Patient, user: MyUser) =>
	user.requestedUsers.some((reqUser) => reqUser.id === patient.id);

export default alreadyRequested;
