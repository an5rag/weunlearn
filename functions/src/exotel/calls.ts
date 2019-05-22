import axios, { AxiosResponse } from "axios";
import { baseUrl } from "./baseURL";
import { secrets } from "./secrets";

const callUrl = baseUrl + "Calls/connect";
const getCallUrl = (callSid: string) => baseUrl + `Calls/${callSid}`;
const getAppUrl = (appId: string) =>
  `https://my.exotel.com/${secrets.accountSid}/exoml/start_voice/${appId}`;

export const makeCall = (
  to: string,
  from: string,
  appId: string,
  callbackUrl?: string
): Promise<AxiosResponse> =>
  axios.post(callUrl, null, {
    params: {
      From: to,
      CallerId: from,
      Url: getAppUrl(appId),
      StatusCallback: callbackUrl || ""
    }
  });

export const getCallDetails = (callSid: string): Promise<AxiosResponse> => {
  return axios.get(getCallUrl(callSid));
};
