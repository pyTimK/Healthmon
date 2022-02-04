import MyUser from "../../../../classes/MyUser";
import useHealthWorkers from "../../../../hooks/useHealthWorkers";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";

interface HealthWorkersSettingsBlockProps {
	user: MyUser;
}

const HealthWorkersSettingsBlock: React.FC<HealthWorkersSettingsBlockProps> = ({ user }) => {
	const { healthWorkers } = useHealthWorkers(user);
	if (healthWorkers.length === 0) return <></>;

	return (
		<SettingsBlock hint='Health Workers'>
			{healthWorkers.map((healthWorker, _i) => (
				<SettingsRow key={_i} title={healthWorker.name} subtitle={healthWorker.number} />
			))}
		</SettingsBlock>
	);
};

export default HealthWorkersSettingsBlock;
