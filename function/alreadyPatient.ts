import { Patient } from "./../classes/MyUser";

const alreadyPatient = (patient: Patient, patients: Patient[]) => patients.some((p) => p.id === patient.id);

export default alreadyPatient;
