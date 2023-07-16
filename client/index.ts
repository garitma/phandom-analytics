import { Client, fql } from "fauna";

type LoadConfig = {
  includedDomains: string[];
};

let secret = "";
let includedDomains: string | string[] = [];
let isLoaded = false;

// Function to set a value in localStorage
const setLocalStorageValue = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

export const client = (secret: string) =>
  new Client({
    secret,
  });

export const load = (siteId: string, config: LoadConfig): void => {
  if (siteId === "") {
    throw new Error("You must provide a siteId");
  }
  secret = siteId;
  includedDomains = config.includedDomains;

  // Set user agent value in localStorage or cookie
  const userAgent = navigator.userAgent;
  setLocalStorageValue("userAgent", userAgent);
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

    // Get user agent value from localStorage or cookie
    const userAgent = localStorage.getItem("userAgent") || "";

    // Query using your app's local variables
    const document_query = fql`
      Visit.create({ 
        url: ${window.location.pathname}, 
        time: Time.now(), 
        userAgent: ${userAgent} 
      }) {
        ts,
      }
    `;
    await client(secret).query(document_query);
  } catch (error) {
    console.log(error);
  }
}
