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

export interface IUser {
  id: string;
  name: string;
  phone: string;
  company: string;
}

export interface UserGroupMembership {
  userId: string;
  groupId: string;
}

export interface IUserGroup {
  id: string;
  name: string;
  description: string;
}
