export interface ICampaignBroadcast {
  dateBroadcasted: Date;
  dateCreated: Date;
  name: string;
  contactGroupId: string;
}

export interface ICampaignBroadcastWithId extends ICampaignBroadcast {
  id: string;
}
