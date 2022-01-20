import { CookiesHelper } from "../classes/CookiesHelper";

interface Props {
  setIsPatient: React.Dispatch<React.SetStateAction<"" | boolean>>;
}

const ChooseRole: React.FC<Props> = ({ setIsPatient }) => {
  const choosePatient = () => {
    CookiesHelper.set("isPatient", true);
    setIsPatient(() => true);
  };

  const chooseHealthWorker = () => {
    CookiesHelper.set("isPatient", false);
    setIsPatient(() => false);
  };

  return (
    <div>
      <div>Choose your role</div>
      <button onClick={choosePatient}>Patient</button>
      <button onClick={chooseHealthWorker}>Health Worker</button>
    </div>
  );
};

export default ChooseRole;
