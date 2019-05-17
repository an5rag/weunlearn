import axios, { AxiosResponse } from "axios";
import { baseUrl } from "./baseURL";
import secrets from "./secrets.json";

const callUrl = baseUrl + "Calls/connect";
const getAppUrl = (appId: string) =>
  `https://my.exotel.com/${secrets.accountSid}/exoml/start_voice/${appId}`;

export const makeCall = (): Promise<AxiosResponse> =>
  axios.post(callUrl, null, {
    params: {
      From: "+12",
      CallerId: "080-468-09273",
      Url: getAppUrl("226414")
    }
  });
