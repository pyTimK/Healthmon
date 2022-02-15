import clsx from "clsx";
import { NextPage } from "next";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../../classes/Constants";
import FacebookIcon from "../../components/icons/social_media/FacebookIcon";
import InstagramIcon from "../../components/icons/social_media/InstagramIcon";
import LinkedInIcon from "../../components/icons/social_media/LinkedInIcon";
import MailIcon from "../../components/icons/social_media/MailIcon";
import TwitterIcon from "../../components/icons/social_media/TwitterIcon";
import Layout from "../../components/layout/Layout";
import Sizedbox from "../../components/Sizedbox";
import styles from "./About.module.css";

const avatarSize = 150;

const About: NextPage = () => {
	return (
		<>
			<Layout title='About - Healthmon' description={PageDescriptions.HOME}>
				<div className={styles.container}>
					<Section title='About'>
						<img src='/img/svg/diamonds.svg' alt='pictures of owners' />

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
						<img src='/img/svg/healthmon.svg' alt='healthmon' />
						<Sizedbox height={30} />
						<p className={styles.info}>
							<em>" The greatest breakthrough of the 21st century. "</em>
						</p>
						<Sizedbox height={10} />
						<p className={styles.info}>- Sun Tzu, The Art of War</p>
					</Section>
					<Section title='Capability'>
						<img src='/img/svg/heartbeat.svg' alt='heartbeat' width={75} height={75} />
						<img src='/img/svg/thermometer.svg' alt='thermometer' width={75} height={75} />
						<img src='/img/svg/blood.svg' alt='blood' width={75} height={75} />
						<p className={styles.info}>3-in-1 measurements</p>
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
	return (
		<div>
			<div className={styles.pioneerContainer}>
				{!right && (
					<div className={styles.pioneerBlob}>
						<img src={`/img/svg/pioneers/${blobImgName}.svg`} alt={blobImgName} />
					</div>
				)}
				<div className={styles.pioneerInfoContainer}>
					<h2 className={styles.pioneerHeader}>Bio</h2>
					<p className={styles.pioneerBioInfo}>{bio}</p>
					<div className={styles.pioneerFollowContainer}>
						<h2 className={styles.pioneerHeader}>Follow {blobImgName}</h2>
						<Sizedbox height={10} />
						<div className={styles.pioneerSocialMediaWrapper}>{children}</div>
					</div>
				</div>

				{right && (
					<div className={styles.pioneerBlob}>
						<img src={`/img/svg/pioneers/${blobImgName}.svg`} alt={blobImgName} />
					</div>
				)}
			</div>
			<Sizedbox height={180} />
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

const Section: React.FC<{ title: string }> = ({ title, children }) => {
	return (
		<div className={styles.section}>
			<h1>{title}</h1>
			<Sizedbox height={30} />
			{children}
			<Sizedbox height={100} />
		</div>
	);
};

export default About;
