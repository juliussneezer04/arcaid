import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
// import WorkerProvider from "@/workers/WorkerProvider";

function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      {/* <WorkerProvider> */}
      <Component {...pageProps} />
      {/* </WorkerProvider> */}
    </ClerkProvider>
  );
}

export default App;
