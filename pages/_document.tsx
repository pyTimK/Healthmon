import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel='manifest' href='/manifest.json' />
          <link rel='apple-touch-icon' href='/img/icons/apple-touch-icon.png'></link>
          <link rel='icon' href='/favicon.ico' />
          <meta name='theme-color' content='#17171B' />
          <meta name='apple-mobile-web-app-status-bar' content='#FFFFFF' />
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
