interface Props {
  size?: number;
  letter?: string;
}

const Avatar: React.FC<Props> = ({ size = 48, letter = "K" }) => {
  const circleStyle = {
    height: size,
    width: size,
    background: "#E4D9CF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#28272C",
    fontSize: 40,
    fontWeight: "bolder",
    borderRadius: Math.floor(size / 2),
  } as React.CSSProperties;

  const letterStyle = {} as React.CSSProperties;

  return (
    <div style={circleStyle}>
      <p style={letterStyle}>{letter.charAt(0)}</p>
    </div>
  );
};

export default Avatar;
