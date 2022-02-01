import { FieldValue } from "firebase/firestore";
import HealthWorker from "./HealthWorker";

interface DeviceData {
	name: string;
	id: string;
	new_name: string;
	new_id: string;
	confirmed: boolean;
	request_timestamp: FieldValue;
}

export default DeviceData;
