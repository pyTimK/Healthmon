import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../comps/Layout";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
      <ToastContainer theme='colored' autoClose={2} />
    </Layout>
  );
}

export default MyApp;
