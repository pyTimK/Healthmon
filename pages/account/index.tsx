import clsx from "clsx";
import { NextPage } from "next";
import React, { CSSProperties, useContext, useRef } from "react";
import { Blob } from "react-blob";
import { ToastContainer } from "react-toastify";
import useDetectKeyboardOpen from "use-detect-keyboard-open";
import { PageDescriptions } from "../../classes/Constants";
import MyAvatar from "../../components/Avatar";
import BackgroundBlob from "../../components/backgroundBlob/BackgroundBlob";
import Layout from "../../components/layout/Layout";
import Sizedbox from "../../components/Sizedbox";
import ButtonStatus from "../../enums/ButtonStatus";
import useAccount from "../../hooks/useAccount";
import { DeviceType } from "../../hooks/useIsSmartphone";
import { AppContext } from "../_app";
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
	} = useAccount();

	const { device } = useContext(AppContext);
	const isKeyboardOpen = useDetectKeyboardOpen();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const avatarSize = device === DeviceType.Smartphone ? 80 : 150;

	// useEffect(() => {
	// 	if (isKeyboardOpen) {
	// 		setTimeout(() => {
	// 			wrapperRef.current?.scrollTo(0, 300);
	// 		}, 1000);
	// 		console.log(wrapperRef.current);
	// 	}
	// }, [isKeyboardOpen]);

	return (
		<Layout hideSideBar={isKeyboardOpen} title='Account - Healthmon' description={PageDescriptions.HOME}>
			<div ref={wrapperRef}>
				<h1>Account</h1>
				<Sizedbox height={30} />
				{/* <BackgroundBlob /> */}
				{authUser && user && (
					<div className={styles.overview}>
						<div className={styles.imgOverview}>
							<MyAvatar
								photoURL={user?.photoURL}
								size={avatarSize}
								letter={authUser.displayName ?? user.name}
								nonclickable
								onFrontAbsolute
							/>
							<Sizedbox height={avatarSize} width={avatarSize} />
							<BackgroundBlob avatarSize={avatarSize} />
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
			<ToastContainer theme='colored' autoClose={2} closeButton={false} />
		</Layout>
	);
};

export default Account;
