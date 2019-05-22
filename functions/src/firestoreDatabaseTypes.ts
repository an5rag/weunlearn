export interface IProject {
  name: string;
  description: string;
  dateCreated: Date;
}

export interface IContact {
  name: string;
  phone: string;
  company: string;
  groupIds: string[];
}

export interface IContactGroup {
  name: string;
  description: string;
}

export interface ICampaign {
  dateCreated: Date;
  name: string;
  description: string;
  appId: string;
  phoneNumber: string;
}

export interface ICampaignBroadcast {
  dateBroadcasted: Date;
  dateCreated: Date;
  name: string;
  contactGroupId: string;
}

export interface ISession {
  phoneNumber: string;
  response: string;
  success: boolean;
  dateCreated: Date;
}
