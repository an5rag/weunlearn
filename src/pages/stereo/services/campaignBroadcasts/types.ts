export interface ICampaignBroadcast {
  dateStarted: Date;
  name: string;
  contactListId: string;
}

export interface ICampaignBroadcastWithId extends ICampaignBroadcast {
  id: string;
}
