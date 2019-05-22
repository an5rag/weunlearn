export interface ICampaign {
  dateCreated: Date;
  name: string;
  description: string;
  appId: string;
  phoneNumber: string;
}

export interface ICampaignWithId extends ICampaign {
  id: string;
}
