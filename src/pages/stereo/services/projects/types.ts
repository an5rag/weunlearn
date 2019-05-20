export interface IProject {
  name: string;
  description: string;
  dateCreated: Date;
}

export interface IProjectWithId extends IProject {
  id: string;
}
