import clsx from "clsx";
import { NextPage } from "next";
import React, { CSSProperties, useEffect, useRef } from "react";
import { Blob } from "react-blob";
import { ToastContainer } from "react-toastify";
import useDetectKeyboardOpen from "use-detect-keyboard-open";
import { PageDescriptions } from "../../classes/Constants";
import Avatar from "../../components/Avatar";
import Layout from "../../components/layout/Layout";
import Sizedbox from "../../components/Sizedbox";
import ButtonStatus from "../../enums/ButtonStatus";
import useAccount from "../../hooks/useAccount";
import { DeviceType } from "../../hooks/useIsSmartphone";
import styles from "./Account.module.css";

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
		device,
	} = useAccount();

	const isSmartphone = device === DeviceType.Smartphone;
	const isKeyboardOpen = useDetectKeyboardOpen();
	const wrapperRef = useRef<HTMLDivElement>(null);

	const avatarSize = isSmartphone ? 80 : 150;
	const smallBlobAvatarSize = isSmartphone ? 100 : 180;
	const largeBlobAvatarSize = isSmartphone ? 115 : 200;

	// useEffect(() => {
	// 	if (isKeyboardOpen) {
	// 		setTimeout(() => {
	// 			wrapperRef.current?.scrollTo(0, 300);
	// 		}, 1000);
	// 		console.log(wrapperRef.current);
	// 	}
	// }, [isKeyboardOpen]);

	return (
		<>
			<Layout hideSideBar={isKeyboardOpen} title='Account - Healthmon' description={PageDescriptions.HOME}>
				<div ref={wrapperRef}>
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
									nonclickable
								/>
								{typeof window !== "undefined" && (
									<BackgroundBlob size={smallBlobAvatarSize} opacity={0.5} avatarSize={avatarSize} />
								)}
								{typeof window !== "undefined" && (
									<BackgroundBlob size={largeBlobAvatarSize} opacity={0.3} avatarSize={avatarSize} />
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
					{/* <Sizedbox height={50} /> */}
					<div className={clsx(styles.signOutButton, editing && "hidden")}>
						<button className='black-button' onClick={logout}>
							Sign out
						</button>
					</div>
					<Sizedbox height={50} />
				</div>
				<ToastContainer theme='colored' autoClose={2} />
			</Layout>
		</>
	);
};

interface BackgroundBlobProps {
	style?: CSSProperties;
	avatarSize: number;
	size: number;
	opacity?: number;
}

const BackgroundBlob: React.FC<BackgroundBlobProps> = React.memo(({ style, size, opacity, avatarSize }) => {
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
});

export default Account;
