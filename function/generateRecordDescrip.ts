import { recordHeaderDescriptions } from "../classes/Constants";
import randomEl from "./randomEl";

const generateRecordDescrip = (isPresent: boolean, isGood: boolean) => {
	const descripList = recordHeaderDescriptions[isPresent ? "present" : "past"][isGood ? "good" : "bad"];
	return randomEl(descripList);
};

export default generateRecordDescrip;
