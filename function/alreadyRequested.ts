import { RequestedUser } from "./../classes/MyUser";
import { Patient } from "../classes/MyUser";

const alreadyRequested = (patient: Patient, requestedUsers: RequestedUser[]) =>
	requestedUsers.some((reqUser) => reqUser.id === patient.id);

export default alreadyRequested;
