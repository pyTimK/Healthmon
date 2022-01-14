import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel='manifest' href='/manifest.json' />
          <link rel='apple-touch-icon' href='/img/icons/apple-touch-icon.png'></link>
          <meta name='theme-color' content='#F7A9CA' />
          <meta name='apple-mobile-web-app-status-bar' content='#0A5E2A' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
