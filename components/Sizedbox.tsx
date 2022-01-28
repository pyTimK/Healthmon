import { NextPage } from "next";
import React from "react";

interface Props {
  width?: number;
  height?: number;
}

const Sizedbox: NextPage<Props> = ({ width = 0, height = 0 }) => {
  const style = { width: width, height: height } as React.CSSProperties;
  return <div style={style} />;
};

export default Sizedbox;
