import axios, { AxiosResponse } from "axios";
import { baseUrl } from "./baseURL";
import { secrets } from "./secrets";

const callUrl = baseUrl + "Calls/connect";
const getAppUrl = (appId: string) =>
  `https://my.exotel.com/${secrets.accountSid}/exoml/start_voice/${appId}`;

export const makeCall = (
  to: string,
  from: string,
  appId: string
): Promise<AxiosResponse> =>
  axios.post(callUrl, null, {
    params: {
      From: to,
      CallerId: from,
      Url: getAppUrl(appId)
    }
    // auth: {
    //   username: secrets.apiKey,
    //   password: secrets.apiToken
    // },
    // withCredentials: true
  });
