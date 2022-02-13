import UserComment from "../types/RecordComment";

const groupCommentsBasedOnPatient = (userComments: UserComment[]) => {
	const groupedCommentsBasedOnPatient: { [key: string]: UserComment[] } = {};

	for (const comment of userComments) {
		if (!groupedCommentsBasedOnPatient[comment.patientId]) {
			groupedCommentsBasedOnPatient[comment.patientId] = [];
		}
		groupedCommentsBasedOnPatient[comment.patientId].push(comment);
	}
	return groupedCommentsBasedOnPatient;
};

export default groupCommentsBasedOnPatient;
