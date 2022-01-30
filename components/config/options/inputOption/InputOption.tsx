import React, { ChangeEventHandler, HTMLInputTypeAttribute, RefObject, useState } from "react";
import styles from "./InputOption.module.css";

interface InputOptionProps {
	inputRef: RefObject<HTMLInputElement>;
	type?: HTMLInputTypeAttribute;
	value?: string;
}

const InputOption: React.FC<InputOptionProps> = ({ inputRef, type = "text", value }) => {
	console.log("InputOption Rerendered");

	return (
		<input
			className={styles.inputOption}
			ref={inputRef}
			type={type}
			defaultValue={value}
			required
			// onChange={onChange}
		/>
	);
};

export default InputOption;
