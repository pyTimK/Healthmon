import type { NextPage } from "next";
import Home from "../comps/Home";
import { useUser } from "../firebase/useUser";

const Entry: NextPage = () => {
  return <Home />;
};

export default Entry;
