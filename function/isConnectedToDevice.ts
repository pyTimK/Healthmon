import { CookiesHelper } from "../classes/CookiesHelper";

const isConnectedToDevice = () => CookiesHelper.get("deviceid", "") !== "";

export default isConnectedToDevice;
