export interface ICampaign {
  id: string;
  dateCreated: Date;
  name: string;
  description: string;
  blastIds: string[];
}

export interface ICampaignBlast {
  dateStarted: Date;
  campaignId: string;
  sessions: ISession[];
  id: string;
}

export interface ISession {
  id: string;
  userName: string;
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
