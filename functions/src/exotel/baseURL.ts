import { secrets } from "./secrets";

export const baseUrl = `https://${secrets.apiKey}:${secrets.apiToken}@${
  secrets.apiUrl
}/${secrets.accountSid}/`;
