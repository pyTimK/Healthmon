import MyUser from "../../../../classes/MyUser";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";

interface HealthWorkersSettingsBlockProps {
	user: MyUser;
}

const HealthWorkersSettingsBlock: React.FC<HealthWorkersSettingsBlockProps> = ({ user }) => {
	if (user.healthWorkers.length === 0) return <></>;

	return (
		<SettingsBlock hint='Health Workers'>
			{user.healthWorkers.map((healthWorker, _i) => (
				<SettingsRow key={_i} title={healthWorker.name} subtitle={healthWorker.number} />
			))}
		</SettingsBlock>
	);
};

export default HealthWorkersSettingsBlock;
