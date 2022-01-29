import { FieldValue } from "firebase/firestore";
import HealthWorker from "./HealthWorker";

interface DeviceData {
	name: string;
	id: string;
	healthWorkers: HealthWorker[];
	new_name: string;
	new_id: string;
	new_healthWorkers: HealthWorker[];
	confirmed: boolean;
	request_timestamp: FieldValue;
}

export default DeviceData;
