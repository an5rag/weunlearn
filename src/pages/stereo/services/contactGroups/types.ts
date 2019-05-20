export interface IContactGroup {
  name: string;
  description: string;
}

export interface IContactGroupWithID extends IContactGroup {
  id: string;
}
