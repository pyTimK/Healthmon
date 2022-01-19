import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../comps/Layout";
import { useUser } from "../firebase/useUser";
import SignInScreen from "./auth";

function MyApp({ Component, pageProps }: AppProps) {
  console.log("fka");
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
