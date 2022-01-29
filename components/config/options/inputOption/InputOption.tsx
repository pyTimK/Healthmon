import { HTMLInputTypeAttribute, RefObject } from "react";
import styles from "./InputOption.module.css";

interface InputOptionProps {
	inputRef: RefObject<HTMLInputElement>;
	type?: HTMLInputTypeAttribute;
	defaultValue?: string;
}

const InputOption: React.FC<InputOptionProps> = ({ inputRef, type = "text", defaultValue }) => {
	return <input className={styles.inputOption} ref={inputRef} type={type} defaultValue={defaultValue} required />;
};

export default InputOption;
