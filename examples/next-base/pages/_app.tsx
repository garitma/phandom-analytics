import { useEffect } from "react";
import type { AppProps } from "next/app";
import "@aura-design/system/main.css";
import "nprogress/nprogress.css";
import { useRouter } from "next/router";
import * as Panthom from "phantom-client/dist";

import "@/styles/main.css";
import "@/styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
   
    Panthom.load(process.env.NEXT_PUBLIC_PHANTOM_SITE_CODE as string, {
      includedDomains: ["localhost"],
      accessToken: process.env.NEXT_PUBLIC_FAUNA_SECRET as string
    });

    function onRouteChangeComplete() {
      Panthom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}

export default MyApp;
