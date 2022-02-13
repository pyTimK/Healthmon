import UserComment from "../types/RecordComment";

const alreadyCommented = (userComments: UserComment[], date: string, time: string) =>
	userComments.some((userComment) => userComment.recordDate === date && userComment.recordTime === time);

export default alreadyCommented;
