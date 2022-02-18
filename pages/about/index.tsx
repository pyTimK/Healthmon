import clsx from "clsx";
import { NextPage } from "next";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../../classes/Constants";
import FacebookIcon from "../../components/icons/social_media/FacebookIcon";
import InstagramIcon from "../../components/icons/social_media/InstagramIcon";
import LinkedInIcon from "../../components/icons/social_media/LinkedInIcon";
import MailIcon from "../../components/icons/social_media/MailIcon";
import TwitterIcon from "../../components/icons/social_media/TwitterIcon";
import Layout from "../../components/layout/Layout";
import Sizedbox from "../../components/Sizedbox";
import { AppContext } from "../_app";
import styles from "./About.module.css";

const avatarSize = 150;

const About: NextPage = () => {
	const { isSmartphone } = useContext(AppContext);
	return (
		<>
			<Layout title='About - Healthmon' description={PageDescriptions.HOME}>
				<div className={styles.container}>
					<Section title='About' noDashTitle>
						<img className={styles.diamondImage} src='/img/svg/diamonds.svg' alt='pictures of owners' />

						<Sizedbox height={50} />
						<div className={styles.aboutInfo}>
							<p className={styles.info}>
								We are LSPU-SPCC ECE students and we are here to introduce you to{" "}
								<span className={styles.pink}>Healthmon</span>, the best health monitoring system ever
								made.
							</p>
						</div>
					</Section>
					<Section title='Healthmon'>
						<img className={styles.healthmonImage} src='/img/svg/healthmon.svg' alt='healthmon' />
						<Sizedbox height={30} />
						<p className={styles.healthmonQuote}>
							<em>&ldquo; The greatest breakthrough of the 21st century. &rdquo;</em>
						</p>

						<p className={styles.healthmonQuoteName}>- Sun Tzu, The Art of War</p>
					</Section>
					<Section title='Capability'>
						<img src='/img/svg/heartbeat.svg' alt='heartbeat' width={75} height={75} />
						<img src='/img/svg/thermometer.svg' alt='thermometer' width={75} height={75} />
						<img src='/img/svg/blood.svg' alt='blood' width={75} height={75} />
						<p className={styles.info}>3-in-1 measurements</p>
						<Sizedbox height={30} />
						<div className={styles.capabilityRow}>
							<CapabilityItem iconName='echodot'>Speaks to you</CapabilityItem>
							<CapabilityItem iconName='sms' right>
								Sends sms
							</CapabilityItem>
						</div>
						<div className={styles.capabilityRow}>
							<CapabilityItem iconName='cloud_upload'>
								Stores result on the
								<br /> cloud
							</CapabilityItem>
							<CapabilityItem iconName='stethoscope' right>
								Pairs you with a Health
								<br /> Worker
							</CapabilityItem>
						</div>
					</Section>
					<Section title='The Pioneers'>
						<div className={styles.pioneersContainer}>
							<Pioneer
								blobImgName='Krisha'
								bio='Singer, rapper, and writer Krisha has made a career of bucking genres and defying
									expectations—her résumé as a musician includes performances at Lollapalooza and
									Glastonbury, co-compositions for 100-voice choir, performances with the Minnesota
									Orchestra, and top-200 entries on the Billboard charts. She contributed to the #1
									album The Hamilton Mixtape: her track, “Congratulations,” has notched over 16
									million streams..'>
								<FacebookIcon />
								<InstagramIcon />
								<TwitterIcon />
								<LinkedInIcon />
								<MailIcon />
							</Pioneer>
							<Pioneer
								right
								blobImgName='Sophia'
								bio='Sophia is a writer, artist and businesswoman who is passionate about her work and her community. She is the author of the book “The Story of My Life,” which was published in 2016. Sophia is currently working in the fields of fashion and design. She is a member of the Philippine Academy of Arts and Crafts, the Philippine Academy of the Arts, and the Philippine Academy of the Humanities.'>
								<FacebookIcon />
								<InstagramIcon />
								<TwitterIcon />
								<LinkedInIcon />
								<MailIcon />
							</Pioneer>
							<Pioneer
								blobImgName='Mikee'
								bio='Mikee is a software engineer, designer, and entrepreneur who is passionate about making the world a better place. He is the co-founder of the company “Lifeline,” which was launched in 2016. Mikee is currently working on a project for the New York City-based nonprofit, The New York Foundation for Children.'>
								<FacebookIcon />
								<InstagramIcon />
								<TwitterIcon />
								<LinkedInIcon />
								<MailIcon />
							</Pioneer>
						</div>
					</Section>
					<Section title='Contact Us'>
						<div className={styles.contactContainer}>
							<div className={styles.contactLeft}>
								<div className={styles.contactItem}>
									<h2 className={styles.contactTitle}>Email</h2>
									<p className={styles.contactInfo}>healthmon.org@gmail.com</p>
								</div>
								<div className={styles.contactItem}>
									<h2 className={styles.contactTitle}>Phone</h2>
									<p className={styles.contactInfo}>09123456789</p>
								</div>
							</div>
							<div className={styles.contactRight}>
								<img src='/img/svg/contact_banner.svg' alt='contact_banner' />
							</div>
						</div>
					</Section>
					<Section title='' noDashTitle noBottomMargin>
						<div className={styles.bottomContainer}>
							{isSmartphone && (
								<div className={styles.bottomRight}>
									<img src='/img/logo_group.png' alt='logo_group' />
								</div>
							)}
							<div className={styles.bottomLeft}>
								<div className={styles.bottomHealthmon}>
									<img
										src='/img/icons/apple-touch-icon.png'
										alt='healthmon_logo'
										width={50}
										height={50}
									/>
									<p className={styles.bottomTitle}>Healthmon</p>
								</div>
								<p className={styles.bottomInfo}>
									This website must be used in conjunction with the Healthmon device developed through
									the research entitled{" "}
									<span className={styles.bottomResearchTitle}>
										IoT-Based Health Monitoring Device with GSM Module for Home Quarantine Patients
										using Raspberry Pi
									</span>
									.
								</p>
								<p className={styles.BottomCopyright}>
									© 2022 Healthmon organization. All Rights Reserved.
								</p>
							</div>
							{!isSmartphone && (
								<div className={styles.bottomRight}>
									<img src='/img/logo_group.png' alt='logo_group' />
								</div>
							)}
						</div>
					</Section>
				</div>
				<ToastContainer theme='colored' autoClose={2} />
			</Layout>
		</>
	);
};

interface PioneerProps {
	blobImgName: string;
	bio: string;
	right?: boolean;
}

const Pioneer: React.FC<PioneerProps> = ({ children, blobImgName, bio, right = false }) => {
	const { isSmartphone } = useContext(AppContext);
	const isRight = right && !isSmartphone;

	return (
		<div>
			<div className={styles.pioneerContainer}>
				{!isRight && (
					<div className={styles.pioneerBlob}>
						<img src={`/img/svg/pioneers/${blobImgName}.svg`} alt={blobImgName} />
					</div>
				)}
				<div className={styles.pioneerInfoContainer}>
					<h2 className={styles.pioneerName}>{blobImgName}</h2>
					<p className={styles.pioneerBioInfo}>{bio}</p>
					<div className={styles.pioneerFollowContainer}>
						<h2 className={styles.pioneerHeader}>Follow {blobImgName}</h2>
						<Sizedbox height={10} />
						<div className={styles.pioneerSocialMediaWrapper}>{children}</div>
					</div>
				</div>

				{isRight && (
					<div className={styles.pioneerBlob}>
						<img src={`/img/svg/pioneers/${blobImgName}.svg`} alt={blobImgName} />
					</div>
				)}
			</div>
		</div>
	);
};

interface CapabilityItemProps {
	iconName: string;
	right?: boolean;
}

const CapabilityItem: React.FC<CapabilityItemProps> = ({ iconName, children, right = false }) => {
	return (
		<div className={clsx(styles.capabilityItemWrapper, right && styles.alignRight)}>
			<div className={styles.capabilityItem}>
				<img src={`/img/svg/${iconName}.svg`} alt={iconName} width={75} height={75} />
				<p className={styles.info}>{children}</p>
			</div>
		</div>
	);
};

interface SectionProps {
	title: string;
	noDashTitle?: boolean;
	noBottomMargin?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, children, noDashTitle = false, noBottomMargin = false }) => {
	const { isSmartphone } = useContext(AppContext);

	return (
		<div className={styles.section}>
			<h1>{noDashTitle ? title : `- ${title} -`}</h1>
			<Sizedbox height={30} />
			{children}
			{!noBottomMargin && <Sizedbox height={isSmartphone ? 50 : 200} />}
		</div>
	);
};

export default About;
