import { User } from "firebase/auth";
import HealthWorker from "./healthWorker";

interface IMyUser {
  name: string;
  id: string;
  isPatient: boolean;
  number: string;
  healthWorkers: HealthWorker[];
}

class MyUser {
  public name: string;
  public id: string;
  public isPatient: boolean;
  public number: string;
  public healthWorkers: HealthWorker[];

  constructor(user?: IMyUser) {
    this.name = user?.name ?? "";
    this.id = user?.id ?? "";
    (this.isPatient = user?.isPatient ?? true), (this.number = user?.number ?? "");
    this.healthWorkers = user?.healthWorkers ?? [];
  }

  static fromFirebaseUser(user: User) {
    return new this({
      name: user.displayName?.substring(0, Math.min(15, user.displayName.length)) ?? "",
      id: user.uid,
      isPatient: true,
      number: user.phoneNumber ?? "",
      healthWorkers: [],
    });
  }
}

export default MyUser;
