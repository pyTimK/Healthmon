import MyUser from "../classes/MyUser";

const isConnectedToDevice = (user: MyUser) => user.device !== "";

export default isConnectedToDevice;
