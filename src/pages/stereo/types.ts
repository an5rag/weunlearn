export interface ICampaign {
  id: string;
  dateCreated: Date;
  name: string;
  description: string;
  appId: string;
  blasts: ICampaignBlast[];
}

export interface ICampaignBlast {
  dateStarted: Date;
  name: string;
  sessions: ISession[];
  id: string;
}

export interface ISession {
  id: string;
  contactId: string;
  phoneNumber: string;
  status: Status;
  duration?: number;
  statusError?: string;
  lastCheckpoint?: "NotStarted" | "Menu" | "Content" | "Questions" | "End";
}

export enum Status {
  "Pending",
  "InProgress",
  "Completed",
  "Failed",
  "Missed"
}
