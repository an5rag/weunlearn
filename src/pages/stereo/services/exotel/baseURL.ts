import secrets from "./secrets.json";
export const baseUrl = `https://${secrets.apiKey}:${secrets.apiToken}@${
  secrets.apiUrl
}/${secrets.accountSid}/`;
