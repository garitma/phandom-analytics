import { Client, fql } from "fauna";

type LoadConfig = {
  includedDomains: string[];
  accessToken: string;
};

let secret = "";
let includedDomains: string | string[] = [];
let isLoaded = false;
let userAgent = "";
let currentSiteId = "";

export const client = (secret: string) =>
  new Client({
    secret,
  });

export const load = (siteId: string, config: LoadConfig): void => {
  if (siteId === "") {
    throw new Error("You must provide a siteId");
  }
  currentSiteId = siteId;
  secret = config.accessToken;
  includedDomains = config.includedDomains;
  userAgent = `${navigator.userAgent}`;

  if (!isLoaded) {
    trackPageview();
    isLoaded = true;
  }
};

export async function trackPageview() {

  try {
    const currentDomain = window.location.hostname;
    if (!includedDomains.includes(currentDomain)) {
      return;
    }

    const document_query = fql`
      Visit.create({ 
        url: ${window.location.pathname}, 
        time: Time.now(), 
        userAgent: ${userAgent},
        site: ${currentSiteId} 
      })
    `;

    await client(secret).query(document_query);
  } catch (error) {
    console.log(error);
  }
}
