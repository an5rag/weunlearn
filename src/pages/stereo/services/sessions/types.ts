export interface ISession {
  contactId: string;
  phoneNumber: string;
  status: Status;
  duration?: number;
  statusError?: string;
  lastCheckpoint?: "NotStarted" | "Menu" | "Content" | "Questions" | "End";
}

export interface ISessionWithId extends ISession {
  id: string;
}

export enum Status {
  "Pending",
  "InProgress",
  "Completed",
  "Failed",
  "Missed"
}
