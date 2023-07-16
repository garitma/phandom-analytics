import { Client, fql } from "fauna";

type LoadConfig = {
  includedDomains: string[];
  accessToken: string;
};

let secret = "";
let includedDomains: string[] = [];
let isLoaded = false;
let userAgent = "";
let currentSiteId = "";
let isBot = false;
let callbackUrl = "";

export const client = (secret: string) =>
  new Client({
    secret,
  });

export const load = async (
  siteId: string,
  config: LoadConfig
): Promise<void> => {
  if (siteId === "") {
    throw new Error("You must provide a siteId");
  }

  const url = window.location.href;
  if (callbackUrl === url) return;

  currentSiteId = siteId;
  secret = config.accessToken;
  includedDomains = config.includedDomains;
  userAgent = `${navigator.userAgent}`;
  isBot = isRobot(userAgent);

  if (isBot) return;
  if (!isLoaded) {
    trackPageview();
    isLoaded = true;
  }
};

export async function trackPageview() {
  if (isBot) return;

  const url = window.location.href;
  if (callbackUrl === url) return;

  try {
    const currentDomain = window.location.hostname;
    if (!includedDomains.includes(currentDomain)) {
      return;
    }

    const document_query = fql`
      Visit.create({ 
        url: ${url}, 
        time: Time.now(), 
        userAgent: ${userAgent},
        site: ${currentSiteId} 
      })
    `;

    await client(secret).query(document_query);
    callbackUrl = url;
  } catch (error) {
    console.log(error);
  }
}

export function isRobot(userAgent: string) {
  const robotPatterns = ["bot", "googlebot", "bingbot", "yandexbot"];

  const regex = new RegExp(robotPatterns.join("|"), "i");
  return regex.test(userAgent);
}
