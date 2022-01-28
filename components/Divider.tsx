import { NextPage } from "next";

interface Props {
  margin?: number;
}

const Divider: NextPage<Props> = ({ margin = 8 }) => {
  const style = { height: "1px", background: "gray", opacity: 0.5, margin: `0 ${margin}px` } as React.CSSProperties;

  return <div style={style} />;
};

export default Divider;
