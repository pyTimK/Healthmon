import clsx from "clsx";
import { NextPage } from "next";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../../classes/Constants";
import Avatar from "../../components/Avatar";
import Layout from "../../components/layout/Layout";
import Sizedbox from "../../components/Sizedbox";
import ButtonStatus from "../../enums/ButtonStatus";
import useAccount from "../../hooks/useAccount";
import styles from "./Account.module.css";
import { Blob, BlobProps } from "react-blob";
import { CSSProperties } from "react";

const avatarSize = 150;
const smallBlobAvatarSize = 180;
const largeBlobAvatarSize = 200;

const Account: NextPage = () => {
	const {
		logout,
		authUser,
		user,
		PersonalDetailsSettingsBlock,
		discardChanges,
		editing,
		saveButtonStatus,
		updateUser,
	} = useAccount();

	return (
		<>
			<Layout title='Account - Healthmon' description={PageDescriptions.HOME}>
				<h1>Account</h1>
				<Sizedbox height={30} />
				{/* <BackgroundBlob /> */}
				{authUser && user && (
					<div className={styles.overview}>
						<div className={styles.imgOverview}>
							<Avatar
								photoURL={user?.photoURL}
								size={avatarSize}
								letter={authUser.displayName ?? user.name}
							/>
							{typeof window !== "undefined" && (
								<BackgroundBlob size={smallBlobAvatarSize} opacity={0.5} />
							)}
							{typeof window !== "undefined" && (
								<BackgroundBlob size={largeBlobAvatarSize} opacity={0.3} />
							)}
						</div>
						<div className={styles.textDetailsOverview}>
							<h2>{authUser.displayName ?? user.name}</h2>
							<p>{authUser.email}</p>
						</div>
					</div>
				)}

				<form onSubmit={updateUser}>
					<PersonalDetailsSettingsBlock />
					<div className={clsx(styles.onChangeButtonWrapper, !editing && "hidden")}>
						<button
							type='reset'
							className={"transparent-button"}
							onClick={discardChanges}
							disabled={saveButtonStatus === ButtonStatus.Disabled}>
							Discard
						</button>
						<button
							type='submit'
							className={"pink-button"}
							disabled={saveButtonStatus === ButtonStatus.Disabled}>
							Save
						</button>
					</div>
				</form>
				<Sizedbox height={50} />
				<div className={styles.signOutButton}>
					<button className='black-button' onClick={logout}>
						Sign out
					</button>
				</div>
				<ToastContainer theme='colored' autoClose={2} />
			</Layout>
		</>
	);
};

interface BackgroundBlobProps {
	style?: CSSProperties;
	size: number;
	opacity?: number;
}

const BackgroundBlob: React.FC<BackgroundBlobProps> = ({ style, size, opacity }) => {
	const offset = Math.floor((size - avatarSize) / 2);

	return (
		<Blob
			size={`${size}px`}
			style={{
				position: "absolute",
				top: `-${offset}px`,
				left: `-${offset}px`,
				// transform: "translate(-50%, -50%)",
				// left: 0,
				backgroundColor: "var(--pink)",
				color: "white",
				opacity: opacity,
				// fontSize: "50vh",
				...style,
			}}
		/>
	);
};

export default Account;
