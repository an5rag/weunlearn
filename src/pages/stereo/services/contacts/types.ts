export interface IContact {
  name: string;
  phone: string;
  company: string;
  groupIds: string[];
}

export interface IContactWithID extends IContact {
  id: string;
}
