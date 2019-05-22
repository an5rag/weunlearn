export interface ISession {
  phoneNumber: string;
  response: Object;
  success: boolean;
  dateCreated: Date;
}

export interface ISessionWithId extends ISession {
  id: string;
}
