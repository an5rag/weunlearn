export interface ISession {
  phoneNumber: string;
  response: string;
  success: boolean;
  dateCreated: Date;
}

export interface ISessionWithId extends ISession {
  id: string;
}
