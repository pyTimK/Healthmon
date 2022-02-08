import React, { ChangeEventHandler, HTMLInputTypeAttribute, RefObject, useState } from "react";
import styles from "./InputOption.module.css";

interface InputOptionProps {
	inputRef: RefObject<HTMLInputElement>;
	type?: HTMLInputTypeAttribute;
	value?: string;
	maxLength?: number;
}

const InputOption: React.FC<InputOptionProps> = ({ inputRef, type = "text", value, maxLength }) => {
	return (
		<input
			className={styles.inputOption}
			ref={inputRef}
			type={type}
			defaultValue={value}
			required
			maxLength={maxLength}
			// onChange={onChange}
		/>
	);
};

export default InputOption;
